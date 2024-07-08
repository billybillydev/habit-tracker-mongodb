import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]),
    MONGO_INITDB_DATABASE: z.string().min(1),
    MONGO_INITDB_ROOT_PASSWORD: z.string().min(1),
    MONGO_INITDB_ROOT_USERNAME: z.string().min(1),
    DATABASE_HOST: z.string().min(1),
    DATABASE_PORT: z.coerce.number(),
    NODE_ENV: z.enum(["development", "production"]),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    GOOGLE_REDIRECT_URI_PATH: z.string(),
    HOST_URL: z.string().min(1),
    SERVER_PORT: z.coerce.number(),
  },
  runtimeEnv: process.env,
});

export const config = {
  db: {
    url: `mongodb://${env.DATABASE_HOST}:${env.DATABASE_PORT}/?authSource=admin`,
  },
  google: {
    credentials: {
      clientId:
        env.GOOGLE_CLIENT_ID || "find your value on google cloud console",
      clientSecret:
        env.GOOGLE_CLIENT_SECRET || "find your value on google cloud console",
    },
    redirectURI: new URL(
      env.NODE_ENV === "production"
        ? env.HOST_URL + env.GOOGLE_REDIRECT_URI_PATH
        : env.HOST_URL + ":" + env.SERVER_PORT + env.GOOGLE_REDIRECT_URI_PATH
    ),
  },
  baseURL: new URL(
    env.NODE_ENV === "production"
      ? env.HOST_URL
      : env.HOST_URL + ":" + env.SERVER_PORT
  ),
  port: env.SERVER_PORT || 3000,
};
