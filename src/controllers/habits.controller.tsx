import { executeHandlerForSessionUser } from "$lib";
import { checkAuthAndRedirectMiddleware, isAuthMiddleware } from "$middlewares/auth.middleware";
import { HabitsPage } from "$pages/habits.page";
import { habitService } from "$services/habits.service";
import { Hono } from "hono";
import { AppVariables } from "src";

export const habitsController = new Hono<{ Variables: AppVariables }>()
  .use(isAuthMiddleware, checkAuthAndRedirectMiddleware)
  .get("/", async ({ html, var: { sessionUser } }) => {
    const habits = await executeHandlerForSessionUser(
      (user) => habitService.findManyByUserId(user.id),
      sessionUser
    );
    return html(<HabitsPage habits={habits} />);
  });
