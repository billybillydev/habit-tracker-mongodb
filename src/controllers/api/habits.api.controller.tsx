import {
  HabitContainer,
  HabitHistoryItem,
  HabitItem,
  HabitList,
  HabitsBulkDeletion,
  HabitsMoreButton,
  NoHabits,
} from "$components/habits.component";
import { EditHabitModal } from "$components/modals.component";
import {
  Notification,
  NotificationItem,
} from "$components/notifications.component";
import { LimitPaginationRadio } from "$components/pagination.component";
import { executeHandlerForSessionUser, getURL } from "$lib";
import { getPaginationQueries, limitValues } from "$lib/pagination";
import { habitService } from "$services/habits.service";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { Types } from "mongoose";
import { AppVariables } from "src";
import { z } from "zod";

export const habitIdApiController = new Hono<{ Variables: AppVariables }>()
  .put(
    zValidator(
      "param",
      z.object({
        id: z.string(),
      })
    ),
    zValidator(
      "form",
      z.object({
        title: z.string(),
        description: z.string(),
      })
    ),
    async ({ req, html }) => {
      const { id } = req.valid("param");
      const body = req.valid("form");
      const updatedHabit = await habitService.updateById(id, body);
      if (!updatedHabit) {
        throw new Error(`Error with habit id: ${id}`);
      }

      return html(
        <HabitItem
          item={updatedHabit}
          triggerNotification={{
            type: "success",
            message: "Habit updated successfully",
          }}
        />
      );
    }
  )
  .delete(
    zValidator(
      "param",
      z.object({
        id: z.string(),
      })
    ),
    async ({ req, html, res }) => {
      const { id } = req.valid("param");
      await habitService.deleteById(id);
      const notification: Notification = {
        type: "success",
        message: "Habit deleted successfully",
      };
      res.headers.append("HX-Trigger", "load-habits");
      return html(<NotificationItem {...notification} />);
    }
  )
  .get(
    "/edit",
    zValidator(
      "param",
      z.object({
        id: z.string(),
      })
    ),
    zValidator(
      "query",
      z.object({
        title: z.string(),
        description: z.string(),
      })
    ),
    ({ html, req, get }) => {
      const sessionUser = get("sessionUser");
      if (!sessionUser) {
        throw new Error("sessionUser doesn't exist");
      }
      const { id } = req.valid("param");
      const query = req.valid("query");
      const props = { ...query, id: new Types.ObjectId(id) };
      return html(<EditHabitModal {...props} />);
    }
  )
  .post(
    "/toggle/:date",
    zValidator(
      "param",
      z.object({
        id: z.string(),
        date: z.string(),
      })
    ),
    async ({ html, req }) => {
      const { date, id } = req.valid("param");
      const updatedExistingHabit = await habitService.updateDateInHistory(id, date);
      
      return html(
        <HabitHistoryItem
          habit={updatedExistingHabit}
          date={date}
          completed={updatedExistingHabit.histories.includes(date)}
        />
      );
    }
  );

export const habitApiController = new Hono<{ Variables: AppVariables }>()
  .get(async ({ html, get, req }) => {
    const url = getURL(req);
    const { limit, page, search } = getPaginationQueries(url);
    const sessionUser = get("sessionUser");
    const [habits, count] = await executeHandlerForSessionUser(
      async (user) =>
        search
          ? await habitService.findManyWithCountByTitle(
              search,
              user.id,
              page > 1 ? page * limit : limit
            )
          : await habitService.findManyWithCountByUserId(
              user.id,
              page > 1 ? page * limit : limit
            ),
      sessionUser
    );
    return html(
      habits.length || search ? (
        <HabitContainer
          count={count}
          habits={habits}
          limit={limit}
          searchValue={search}
        />
      ) : (
        <NoHabits />
      )
    );
  })
  .post(
    zValidator(
      "form",
      z.object({
        title: z.string(),
        description: z.string(),
        color: z.string(),
      })
    ),
    async ({ req, text, html, get, res }) => {
      const sessionUser = get("sessionUser");
      if (!sessionUser) {
        throw new Error("Error session user");
      }
      const body = req.valid("form");

      if (body.color === "#000000") {
        res.headers.append("HX-Reswap", "innerHTML");
        return text("Please select another color than black", 400);
      }

      const [createdHabit, habitsCount] = await executeHandlerForSessionUser(
        async (user) =>
          Promise.all([
            habitService.create({
              ...body,
              userId: user.id,
            }),
            habitService.count(user.id),
          ]),
        sessionUser
      );

      if (!createdHabit) {
        res.headers.append("HX-Reswap", "innerHTML");
        return text("An error occured", 500);
      }
      if (habitsCount === 0) {
        res.headers.append("HX-Reswap", "outerHTML");
        return html(<HabitList habits={[createdHabit]} />, 201);
      }
      return html(
        <HabitItem
          item={createdHabit}
          triggerNotification={{
            type: "success",
            message: "Habit created successfully",
          }}
        />,
        201
      );
    }
  )
  .get(
    "/more",
    zValidator(
      "query",
      z.object({
        limit: z.coerce.number(),
        currentHabitLength: z.coerce.number(),
      })
    ),
    async ({ html, get, req, res }) => {
      const url = getURL(req);
      const { page, search } = getPaginationQueries(url);
      const { limit, currentHabitLength } = req.valid("query");
      const sessionUser = get("sessionUser");
      const [habits, count] = await executeHandlerForSessionUser(
        async (user) =>
          search
            ? await habitService.findManyWithCountByTitle(
                search,
                user.id,
                limit,
                currentHabitLength
              )
            : await habitService.findManyWithCountByUserId(
                user.id,
                limit,
                currentHabitLength
              ),
        sessionUser
      );
      url.searchParams.set("limit", String(limit));
      url.searchParams.set("page", String(page + 1));
      if (search) {
        url.searchParams.set("search", search);
      }
      url.searchParams.sort();
      res.headers.append("HX-Push-Url", url.href);
      return html(
        <>
          {habits.map((habit) => (
            <HabitItem item={habit} />
          ))}
          <HabitsMoreButton
            habitLength={currentHabitLength + habits.length}
            count={count}
          />
        </>
      );
    }
  )
  .get(
    "/search",
    zValidator(
      "query",
      z.object({
        value: z.string(),
      })
    ),
    async ({ req, get, html, header }) => {
      const url = getURL(req);
      const { limit, page } = getPaginationQueries(url);
      const { value } = req.valid("query");
      const sessionUser = get("sessionUser");
      const [habits, count] = await executeHandlerForSessionUser(
        async (user) =>
          value
            ? await habitService.findManyWithCountByTitle(
                value,
                user.id,
                page > 1 ? page * limit : limit
              )
            : await habitService.findManyWithCountByUserId(
                user.id,
                page > 1 ? page * limit : limit
              ),
        sessionUser
      );
      if (value) {
        url.searchParams.set("search", value);
      } else {
        url.searchParams.delete("search");
      }
      url.searchParams.sort();
      header("HX-Push-Url", url.href);
      return html(
        <>
          <LimitPaginationRadio limit={limit} count={count} />
          <HabitList habits={habits} />
          <HabitsMoreButton habitLength={habits.length} count={count} />
        </>
      );
    }
  )
  .get("/bulk", ({ html }) => {
    return html(<HabitsBulkDeletion />);
  })
  .post("/samples", async ({ get, html }) => {
    const limit = limitValues[0];
    const sessionUser = get("sessionUser");
    const habits = await executeHandlerForSessionUser(
      (user) => habitService.seed(user.id),
      sessionUser
    );

    return html(
      <HabitContainer
        count={habits.length}
        habits={habits.slice(0, limit)}
        limit={limit}
      />
    );
  })
.delete(
  "/bulk",
  zValidator("query", z.object({ items: z.array(z.string()) })),
  async ({ req, html, res }) => {
    const { items } = req.valid("query");
    const deletedResultCount = await habitService.deleteBulkIds(items);
    const notification: Notification = {
      type: "success",
      message: deletedResultCount + "selected habits deleted successfully",
    };
    res.headers.append("HX-Trigger", "load-habits");
    
    return html(<NotificationItem {...notification} />);
  }
)
.route("/:id", habitIdApiController);
