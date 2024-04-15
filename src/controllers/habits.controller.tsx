import { executeHandlerForSessionUser } from "$lib";
import {
  checkAuthAndRedirectMiddleware,
  isAuthMiddleware,
} from "$middlewares/auth.middleware";
import { HabitsPage } from "$pages/habits.page";
import { habitService } from "$services/habits.service";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { AppVariables } from "src";
import { limitValues } from "src/lib/pagination";
import { z } from "zod";

export const habitsController = new Hono<{ Variables: AppVariables }>()
  .use(isAuthMiddleware, checkAuthAndRedirectMiddleware)
  .get(
    "/",
    zValidator(
      "query",
      z.object({
        search: z.optional(z.string()),
        limit: z.optional(
          z.coerce
            .number()
            .transform((val) => (limitValues.includes(val) ? val : limitValues[0]))
        ),
        page: z.optional(z.coerce.number().transform((val) => val < 1 ? 1 : val)),
      })
    ),
    async ({ html, get, req }) => {
      const { limit = 4, page = 1, search } = req.valid("query");
      const sessionUser = get("sessionUser");
      const [habits, count] = await executeHandlerForSessionUser(
        async (user) =>
          Promise.all(
            search
              ? [
                  habitService.findByTitle(
                    search,
                    user.id,
                    page > 1 ? page * limit : limit,
                  ),
                  habitService.countTitle(search, user.id),
                ]
              : [
                  habitService.findManyByUserId(
                    user.id,
                    page > 1 ? page * limit : limit,
                  ),
                  habitService.count(user.id),
                ]
          ),
        sessionUser
      );
      return html(
        <HabitsPage
          sessionUser={sessionUser}
          habits={habits}
          searchValue={search}
          count={count}
          limit={limit}
        />
      );
    }
  );
