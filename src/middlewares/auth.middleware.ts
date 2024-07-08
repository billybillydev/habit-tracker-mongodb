import { lucia } from "$auth";
import { MiddlewareHandler } from "hono";
import { getCookie } from "hono/cookie";
import { AppVariables } from "src";

export const isAuthMiddleware: MiddlewareHandler<{
  Variables: AppVariables;
}> = async (ctx, next) => {
  const auth_session = getCookie(ctx, "auth_session");
  if (auth_session) {
    const { user } = await lucia.validateSession(auth_session);
    ctx.set("isAuth", !!user);
  }
  await next();
};

export const checkAuthAndRedirectMiddleware: MiddlewareHandler<{
  Variables: AppVariables;
}> = async ({ var: { isAuth }, redirect}, next) => {
  if (!isAuth) {
    return redirect("/login");
  }
  await next();
};
