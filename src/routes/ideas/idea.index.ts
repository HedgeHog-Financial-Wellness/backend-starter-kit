import { createRouter } from "@/lib/create-app.js";

import * as ideaHandler from "./idea.handler.js";
import * as ideaRoutes from "./idea.routes.js";

const router = createRouter()
  .openapi(ideaRoutes.create, ideaHandler.create)
  .openapi(ideaRoutes.list, ideaHandler.list);

export default router;
