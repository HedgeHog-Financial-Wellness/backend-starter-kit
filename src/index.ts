import { serve } from "@hono/node-server";

import app from "./app.js";
import env from "./env.js";
import { systemLogger } from "./middlewares/pino-logger.js";

const port = Number(env.PORT || 4444);

systemLogger.info(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
