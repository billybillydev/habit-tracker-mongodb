import { MiddlewareHandler } from "hono";
import { getCookie } from "hono/cookie";
import { AppVariables } from "src";

export const isAuthMiddleware: MiddlewareHandler<{
  Variables: AppVariables;
}> = async (ctx, next) => {
  const lucia_session = getCookie(ctx, "lucia_session");
  if (lucia_session) {
    const { user } = await ctx.var.lucia.validateSession(lucia_session);
    ctx.set("isAuth", !!user);
  }
  await next();
};

export const checkAuthAndRedirectMiddleware: MiddlewareHandler<{
  Variables: AppVariables;
}> = async ({ var: { isAuth }, redirect, status}, next) => {
  if (!isAuth) {
    status(401);
    redirect("/login");
  }
  await next();
};
