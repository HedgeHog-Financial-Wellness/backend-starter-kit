import type { z } from "zod";

import type { getIdeaSchemaResBody, listIdeaSchemaResBody } from "./ideas.schema.js";

export interface IdeaRepository {
  listIdeas: () => Promise<z.infer<typeof listIdeaSchemaResBody>>;
  getIdea: (slug: string) => Promise<z.infer<typeof getIdeaSchemaResBody> | null>;
}
