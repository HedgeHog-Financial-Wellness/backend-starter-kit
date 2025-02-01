import { createRoute } from "@hono/zod-openapi";

import * as HTTP_STATUS_CODES from "@/framework/hono/http-status-codes.js";
import jsonContent from "@/framework/hono/openapi/helpers/json-content.js";
import createMessageObjectSchema from "@/framework/hono/openapi/schemas/create-message-object.js";
import { createRouter } from "@/lib/create-app.js";

const router = createRouter().openapi(
  createRoute({
    tags: ["Index"],
    method: "get",
    path: "/",
    responses: {
      [HTTP_STATUS_CODES.OK]: jsonContent(
        createMessageObjectSchema("Task API Index"),
        "Task API Index",
      ),
    },
  }),
  (c) => {
    return c.json({ message: "Task API Index" }, HTTP_STATUS_CODES.OK);
  },
);

export default router;
