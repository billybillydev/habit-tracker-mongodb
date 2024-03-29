import { auth, lucia, SessionUser } from "$auth";
import { apiController } from "$controllers/api/*";
import { habitsController } from "$controllers/habits.controller";
import { homeController } from "$controllers/home.controller";
import { loginController } from "$controllers/login.controller";
import { registerController } from "$controllers/register.controller";
import { db } from "$db";
import { htmxMiddleware } from "$middlewares/htmx.middleware";
import { sessionMiddleware } from "$middlewares/session.middleware";
import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { config } from "$config";
import { NotFoundPage } from "$pages/404.page";

type Cookie = Partial<{
  google_code_verifier: string;
  google_state: string;
  lucia_session: string;
}>;

export type AppVariables = {
  isHTMX?: boolean;
  lucia: typeof lucia;
  auth: typeof auth;
  db: typeof db;
  cookie: Cookie;
  sessionUser?: SessionUser;
  isAuth?: boolean;
};

const app = new Hono<{ Variables: AppVariables }>();

app
  .use("/public/*", serveStatic({ root: "./" }))
  .use(async ({ set }, next) => {
    set("auth", auth);
    set("db", db);
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
    console.error(`${err}`);
    return c.text("An Error occured", 500);
  })
  .notFound(({ redirect }) => {
    return redirect("/404");
  });

export default {
  port: config.port,
  fetch: app.fetch,
};
