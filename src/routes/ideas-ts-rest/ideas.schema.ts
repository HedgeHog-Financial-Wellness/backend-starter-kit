import { extendZodWithOpenApi } from "@anatine/zod-openapi";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { ideasTable } from "../../db/schema/ideas.js";

extendZodWithOpenApi(z);

export const getIdeaSchemaResBody = createSelectSchema(ideasTable).omit({
  id: true,
}).openapi({
  title: "Idea",
  description: "An idea Schema",
});

export const getIdeaRequestSchema = z.object({
  slug: z.string().min(1).max(12),
});

export const listIdeaSchemaResBody = z.array(getIdeaSchemaResBody).openapi({
  title: "Idea List",
  description: "A list of ideas",
});
