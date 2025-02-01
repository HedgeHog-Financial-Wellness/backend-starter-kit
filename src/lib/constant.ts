import * as HTTP_STATUS_PHRASES from "@/framework/hono/http-status-phrases.js";
import createMessageObjectSchema from "@/framework/hono/openapi/schemas/create-message-object.js";

export const notFoundSchema = createMessageObjectSchema(
  HTTP_STATUS_PHRASES.NOT_FOUND,
);
