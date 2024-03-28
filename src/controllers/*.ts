import { Hono } from "hono";
import { homeController } from "./home.controller";
import { loginController } from "./login.controller";
import { registerController } from "./register.controller";
import { htmxMiddleware } from "$middlewares/htmx.middleware";
import { sessionMiddleware } from "$middlewares/session.middleware";
import { habitsController } from "./habits.controller";

export const router = new Hono();

router
  .use(htmxMiddleware, sessionMiddleware)
  .route("/", homeController)
  .route("/login", loginController)
  .route("/register", registerController)
  .route("/habits", habitsController);
