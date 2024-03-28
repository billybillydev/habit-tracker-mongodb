import { auth, lucia, SessionUser } from "$auth";
import { router } from "$controllers/*";
import { db } from "$db";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { serveStatic } from "hono/bun";
import { config } from "./config";

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
  .use(cors({
    origin(origin) {
      return origin;
    }
  }))
  .use(async ({ set }, next) => {
    set("auth", auth);
    set("db", db);
    set("lucia", lucia);
    await next();
  })
  .route("/", router);

export default {
  port: config.port,
  fetch: app.fetch,
};
