import { auth, lucia, SessionUser } from "$auth";
import { apiController } from "$controllers/api/*";
import { habitsController } from "$controllers/habits.controller";
import { homeController } from "$controllers/home.controller";
import { loginController } from "$controllers/login.controller";
import { registerController } from "$controllers/register.controller";
import { connectDB, handleDisconnectDBWhenExit } from "$db";
import { htmxMiddleware } from "$middlewares/htmx.middleware";
import { sessionMiddleware } from "$middlewares/session.middleware";
import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { config } from "$config";
import { NotFoundPage } from "$pages/404.page";

type Cookie = Partial<{
  google_code_verifier: string;
  google_state: string;
  auth_session: string;
}>;

export type AppVariables = {
  isHTMX?: boolean;
  lucia: typeof lucia;
  auth: typeof auth;
  cookie: Cookie;
  sessionUser?: SessionUser;
  isAuth?: boolean;
};

const app = new Hono<{ Variables: AppVariables }>();
connectDB();

// process.on("SIGINT", handleDisconnectDBWhenExit);
// process.on("SIGTERM", handleDisconnectDBWhenExit);

app
  .use("/public/*", serveStatic({ root: "./" }))
  .use(async ({ set }, next) => {
    set("auth", auth);
    set("lucia", lucia);
    await next();
  })
  .use(htmxMiddleware, sessionMiddleware)
  .route("/", homeController)
  .route("/login", loginController)
  .route("/register", registerController)
  .route("/habits", habitsController)
  .route("/api", apiController)
  .get("/404", ({ html }) => {
    return html(<NotFoundPage />);
  })
  .onError((err, c) => {
    console.error(err);
    return c.text("An Error occured", 500);
  })
  .notFound(({ redirect }) => {
    return redirect("/404");
  });

console.log(process.env.NODE_ENV);
export default {
  port: config.port,
  fetch: app.fetch,
};
