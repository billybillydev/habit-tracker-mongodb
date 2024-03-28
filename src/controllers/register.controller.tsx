import { RegisterPage } from "$pages/register.page";
import { Hono } from "hono";

export const registerController = new Hono()
  .get("/", ({ html }) => {
    return html(<RegisterPage />);
  });
