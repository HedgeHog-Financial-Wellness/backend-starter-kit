import { createSelectSchema } from "drizzle-zod";
import { ideasTable } from "../../db/schema/ideas.js";

export const listIdeasSchemaResBody = createSelectSchema(ideasTable).omit({
  id: true,
});
