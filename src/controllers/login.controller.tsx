import { Hono } from "hono";
import { AppVariables } from "src";
import { LoginPage } from "$pages/login.page";
import { getCookie, deleteCookie } from "hono/cookie";

export const loginController = new Hono<{Variables: AppVariables}>()
  .get("/", (ctx) => {
    const { html } = ctx;
    const errorGoogle = getCookie(ctx, "error_google");
    if (errorGoogle) {
      deleteCookie(ctx, "error_google");
    }
    return html(<LoginPage errorGoogle={errorGoogle} />);
  });
