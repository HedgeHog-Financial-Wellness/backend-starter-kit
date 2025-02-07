import type { z } from "zod";

import type { IdeaRepository } from "./idea.repository.js";
import { getIdeaSchemaResBody, listIdeaSchemaResBody } from "./ideas.schema.js";

export class IdeaService {
  constructor(private ideaRepository: IdeaRepository) {}

  async listIdeas(): Promise<z.infer<typeof listIdeaSchemaResBody>> {
    return this.ideaRepository.listIdeas();
  }

  async getIdea(slug: string): Promise<z.infer<typeof getIdeaSchemaResBody> | null> {
    return await this.ideaRepository.getIdea(slug);
  }
}
