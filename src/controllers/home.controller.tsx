import { Hono } from "hono";
import { HomePage } from "../pages/home.page";

export const homeController = new Hono().get("/", (ctx) => {
    return ctx.html(<HomePage />);
})