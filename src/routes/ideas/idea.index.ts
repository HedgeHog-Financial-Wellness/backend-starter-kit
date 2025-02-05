import { createRouter } from "@/lib/create-app.js";

import { create as createHandler } from "./idea.handler.js";
import { create as createRoute } from "./idea.routes.js";

const router = createRouter()
  .openapi(createRoute, createHandler);

export default router;
