import { Hono } from "hono";
import { homeController } from "./home.controller";
import { loginController } from "./login.controller";
import { registerController } from "./register.controller";
import { htmxMiddleware } from "$middlewares/htmx.middleware";

export const router = new Hono();

router
  .use(htmxMiddleware)
  .route("/", homeController)
  .route("/login", loginController)
  .route("/register", registerController);
