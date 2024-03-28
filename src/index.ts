import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { config } from "./config";
import { router } from "$controllers/*";

export type AppVariables = {
  isHTMX?: boolean;
};

const app = new Hono();

app.use("/public/*", serveStatic({ root: "./" }));
app.route("/", router)

export default {
  port: config.port,
  fetch: app.fetch,
};
