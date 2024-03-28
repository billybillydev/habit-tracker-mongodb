import { Hono } from "hono";
import { authApiController } from "$controllers/api/auth.api.controller";
import { habitApiController } from "$controllers/api/habits.api.controller";
import { notificationApiController } from "$controllers/api/notification.api.controller";

export const apiController = new Hono()
  .route("/auth", authApiController)
  .route("/habits", habitApiController)
  .route("/notifications", notificationApiController);
