import { MiddlewareHandler } from "hono";
import { getCookie } from "hono/cookie";
import { AppVariables } from "src";

export const sessionMiddleware: MiddlewareHandler<{
  Variables: AppVariables;
}> = async (ctx, next) => {
  const lucia_session = getCookie(ctx, "lucia_session");
  if (lucia_session) {
    const { user } = await ctx.var.lucia.validateSession(lucia_session);
    if (user) {
      ctx.set("sessionUser", { id: user.id, name: user.name, email: user.email });
    }
  }
  await next();
};
