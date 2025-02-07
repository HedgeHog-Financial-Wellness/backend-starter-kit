import { createSelectSchema } from "drizzle-zod";
import { ideasTable } from "../../db/schema/ideas.js";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const listIdeasZodSchemaResBody = createSelectSchema(ideasTable).omit({
  id: true,
}).openapi("ListIdeasResponse");

export const listIdeasRegistry = new OpenAPIRegistry();
listIdeasRegistry.registerPath({
  method: "get",
  path: "/ideas",
  tags: ["Ideas"],
  responses: {
    200: {
      description: "List of ideas",
      content: {
        "application/json": {
          schema: z.array(listIdeasZodSchemaResBody),
        },
      },
    },
  },
});