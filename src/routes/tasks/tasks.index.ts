import { createRouter } from "@/lib/create-app.js";

import * as handler from "./task.handler.js";
import * as routes from "./task.routes.js";

const router = createRouter()
  .openapi(routes.list, handler.list)
  .openapi(routes.create, handler.create)
  .openapi(routes.getOne, handler.getOne)
  .openapi(routes.patch, handler.patch)
  .openapi(routes.deleteOne, handler.deleteOne);

export default router;
