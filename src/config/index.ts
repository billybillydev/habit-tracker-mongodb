import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

const env = createEnv({
  server: {
    LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]),
    DATABASE_CONNECTION_TYPE: z.enum(["local", "remote", "local-replica"]),
    DATABASE_URL: z.string().min(1),
    DATABASE_AUTH_TOKEN: z
      .string()
      .optional()
      .refine((s) => {
        // not needed for local only
        const type = process.env.DATABASE_CONNECTION_TYPE;
        return type === "remote" || type === "local-replica"
          ? s && s.length > 0
          : true;
      }),
    NODE_ENV: z.enum(["development", "production"]),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    GOOGLE_REDIRECT_URI_PATH: z.string(),
    HOST_URL: z.string().min(1),
    PORT: z.string(),
    TURSO_API_KEY: z.string().min(1),
  },
  runtimeEnv: process.env,
});

export const config = {
  db: {
    authToken: env.DATABASE_AUTH_TOKEN,
    url: env.DATABASE_URL,
    type: env.DATABASE_CONNECTION_TYPE,
  },
  google: {
    credentials: {
      clientId:
        env.GOOGLE_CLIENT_ID || "find your value on google cloud console",
      clientSecret:
        env.GOOGLE_CLIENT_SECRET || "find your value on google cloud console",
    },
    redirectURI: new URL(
      env.HOST_URL + ":" + env.PORT + env.GOOGLE_REDIRECT_URI_PATH
    ),
  },
  baseURL: new URL(env.HOST_URL + ":" + env.PORT),
  port: Number(env.PORT) || 3000,
  turso: {
    apiKey: env.TURSO_API_KEY
  }
};
