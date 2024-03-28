import { type Config } from "drizzle-kit";
import { config } from "./src/config";

const dbCredentials = {
  url: config.db.url,
  authToken: config.db.authToken!,
};

export default {
  schema: "./src/db/schema/index.ts",
  out: "./migrations",
  driver: "turso",
  dbCredentials,
  verbose: true,
  strict: true,
  tablesFilter: ["!libsql_wasm_func_table"],
} satisfies Config;
