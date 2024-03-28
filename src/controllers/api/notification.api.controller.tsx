import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { NotificationItem } from "$components/notifications.component";

export const notificationApiController = new Hono()
  .get("/register/success", ({ html }) => {
    return html(
      <NotificationItem
        message="Your account has successfully been created"
        type="success"
      />
    );
  })
  .post(
    "/",
    zValidator(
      "form",
      z.object({
        type: z.enum(["success", "error", "info", "warning"]),
        message: z.string(),
      })
    ),
    ({ html, req }) => {
      const body = req.valid("form");
      return html(<NotificationItem {...body} />);
    }
  );
