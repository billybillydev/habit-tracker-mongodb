import { Hono } from "hono";
import { authApiController } from "./auth.api.controller";
import { notificationApiController } from "./notification.api.controller";

export const apiController = new Hono()
  .route("/auth", authApiController)
  .route("/notifications", notificationApiController);
