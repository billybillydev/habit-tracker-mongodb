import { executeHandlerForSessionUser } from "$lib";
import { checkAuthAndRedirectMiddleware, isAuthMiddleware } from "$middlewares/auth.middleware";
import { HabitsPage } from "$pages/habits.page";
import { habitService } from "$services/habits.service";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { AppVariables } from "src";
import { z } from "zod";

export const habitsController = new Hono<{ Variables: AppVariables }>()
  .use(isAuthMiddleware, checkAuthAndRedirectMiddleware)
  .get(
    "/",
    zValidator(
      "query",
      z.optional(z.object({ search: z.optional(z.string()) }))
    ),
    async ({ html, get, req }) => {
      const search = req.valid("query")?.search;
      const sessionUser = get("sessionUser");
      const habits = await executeHandlerForSessionUser(
        (user) =>
          search
            ? habitService.findByTitle(search, user.id)
            : habitService.findManyByUserId(user.id),
        sessionUser
      );
      return html(<HabitsPage habits={habits} searchValue={search} />);
    }
  );
