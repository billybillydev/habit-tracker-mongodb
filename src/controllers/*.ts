import { Hono } from "hono";
import { homeController } from "./home.controller";
import { loginController } from "./login.controller";
import { registerController } from "./register.controller";

export const router = new Hono();

router
  .route("/", homeController)
  .route("/login", loginController)
  .route("/register", registerController);
