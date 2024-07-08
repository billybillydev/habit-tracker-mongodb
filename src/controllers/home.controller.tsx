import { Hono } from "hono";
import { AppVariables } from "src";
import { isAuthMiddleware } from "$middlewares/auth.middleware";
import { HomePage } from "$pages/home.page";

export const homeController = new Hono<{ Variables: AppVariables }>()
  .use(isAuthMiddleware)
  .get("/", ({ var: { isAuth }, html }) => {
    console.log("isAuth in home:", isAuth);
    return html(<HomePage isAuth={isAuth} />);
  });
