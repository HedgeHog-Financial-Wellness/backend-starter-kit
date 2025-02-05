import { createRoute } from "@hono/zod-openapi";

import { createIdeaSchemaReqBody, createIdeaSchemaResBody } from "@/db/schema.js";
import * as HTTP_STATUS_CODES from "@/framework/hono/http-status-codes.js";
import jsonContent from "@/framework/hono/openapi/helpers/json-content.js";

// idea routes
// here we are defining the routes for the ideas

const tags = ["Ideas"];

const create = createRoute({
  path: "/ideas",
  method: "post",
  tags,
  request: {
    body: {
      content: {
        "application/json": {
          schema: createIdeaSchemaReqBody,
        },
      },
      description: "The idea to create",
    },
    required: true,
  },
  responses: {
    [HTTP_STATUS_CODES.OK]: jsonContent(createIdeaSchemaResBody, "The idea created"),
  },
});

export type CreateRoute = typeof create;

export { create };
