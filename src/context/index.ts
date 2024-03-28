import { html } from "@elysiajs/html";
import { Elysia, t } from "elysia";
import { db } from "../db";
import { auth, lucia } from "../auth";

export const context = new Elysia({ name: "@app/ctx" })
  .decorate("db", db)
  .decorate("auth", auth)
  .decorate("lucia", lucia)
  .use(html())
  .guard({
    cookie: t.Cookie({
      google_code_verifier: t.Optional(t.String()),
      google_state: t.Optional(t.String()),
      lucia_session: t.Optional(t.String()),
    }),
  });
