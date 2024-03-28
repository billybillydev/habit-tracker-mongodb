import { NotificationItem } from "$components/notifications.component";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

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
      "json",
      z.object({
        type: z.union([
          z.literal("success"),
          z.literal("error"),
          z.literal("info"),
          z.literal("warning"),
        ]),
        message: z.string(),
      })
    ),
    ({ html, req }) => {
        const body = req.valid("json");
      return html(<NotificationItem {...body} />);
    }
  );
