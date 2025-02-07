import { config } from "dotenv";
import { expand } from "dotenv-expand";
import { z } from "zod";
import { systemLogger } from "./utils/logger.js";

expand(config());

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(4000),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]),
  DATABASE_URL: z.string().url(),
});

export type Env = z.infer<typeof EnvSchema>;

// eslint-disable-next-line import/no-mutable-exports
let env: Env;

try {
  systemLogger.info("Parsing environment variables");
  // eslint-disable-next-line node/no-process-env
  env = EnvSchema.parse(process.env);
  systemLogger.info("Environment variables parsed successfully");
}
catch (error) {
  const err = error as z.ZodError;
  systemLogger.error("❌ Invalid environment variables:", err.flatten().fieldErrors);
  process.exit(1);
}

export default env;
