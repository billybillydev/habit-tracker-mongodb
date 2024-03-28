import { Hono } from "hono";
import { authApiController } from "./auth.api.controller";

export const apiController = new Hono().route("/auth", authApiController);
