import { OpenAPIHono } from "@hono/zod-openapi";

import type { AppBinding, AppOpenAPI } from "@/lib/types.js";

import notFound from "@/framework/hono/middlewares/not-found.js";
import onError from "@/framework/hono/middlewares/on-error.js";
import defaultHook from "@/framework/hono/openapi/default-hook.js";
import { pinoLogger } from "@/middlewares/pino-logger.js";

export function createRouter() {
  return new OpenAPIHono<AppBinding>({
    strict: false,
    defaultHook,
  });
}

export default function createApp() {
  const app = createRouter();

  app.use(pinoLogger());

  app.notFound(notFound);
  app.onError(onError);

  return app;
}


export function createTestApp(router: AppOpenAPI) {
  const testApp = createApp();
  testApp.route("/", router);
  return testApp;
}

