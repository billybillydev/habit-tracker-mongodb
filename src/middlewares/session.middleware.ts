import { lucia } from "$auth";
import { MiddlewareHandler } from "hono";
import { getCookie } from "hono/cookie";
import { AppVariables } from "src";

export const sessionMiddleware: MiddlewareHandler<{
  Variables: AppVariables;
}> = async (ctx, next) => {
  const auth_session = getCookie(ctx, "auth_session");
  if (auth_session) {
    const { user } = await lucia.validateSession(auth_session);
    if (user) {
      ctx.set("sessionUser", { id: user.id, name: user.name, email: user.email });
    }
  }
  await next();
};
