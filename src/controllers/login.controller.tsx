import { LoginPage } from "$pages/login.page";
import { Hono } from "hono";

export const loginController = new Hono()
  .get("/", ({ html }) => {
    return html(<LoginPage />);
  });
