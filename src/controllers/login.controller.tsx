import { Hono } from "hono";
import { AppVariables } from "src";
import { LoginPage } from "$pages/login.page";

export const loginController = new Hono<{Variables: AppVariables}>()
  .get("/", ({ html }) => {
    return html(<LoginPage />);
  });
