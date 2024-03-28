import { checkAuthAndRedirectMiddleware, isAuthMiddleware } from "$middlewares/auth.middleware";
import { HabitsPage } from "$pages/habits.page";
import { habitService } from "$services/habits.service";
import { Hono } from "hono";
import { AppVariables } from "src";

export const habitsController = new Hono<{ Variables: AppVariables }>()
  .use(isAuthMiddleware, checkAuthAndRedirectMiddleware)
  .get("/", async ({ html, var: { sessionUser } }) => {
    if (!sessionUser) {
        throw new Error("Error session user");
        
    }
    const habits = await habitService.findManyByUserId(sessionUser.id);
    return html(<HabitsPage habits={habits} />);
  });
