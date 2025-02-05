import { defineConfig } from "drizzle-kit";

// @ts-expect-error WIP: check the setup
import env from "./src/env";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
