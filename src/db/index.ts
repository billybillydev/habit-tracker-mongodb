import { config } from "$config";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from '$db/schema';

const options = (() => {
  switch (config.db.type) {
    case "remote":
      return {
        url: config.db.url,
        authToken: config.db.authToken,
      };
    case "local-replica":
      return {
        url: "file:local.sqlite",
        syncUrl: config.db.url,
        authToken: config.db.authToken,
      };
    case "local":
    default:
      return {
        url: "file:local.sqlite",
      };
  }
})();

export const client = createClient(options);

if (config.db.type === "local-replica") {
  await client.sync();
}

export const db = drizzle(client, { schema, logger: false });