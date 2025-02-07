import type { z } from "zod";
import { ideasTable } from "@/db/schema/ideas.js";
import { listIdeaSchemaResBody, getIdeaSchemaResBody } from "./ideas.schema.js";
import { drizzle } from "drizzle-orm/node-postgres";
import type { IdeaRepository } from "./idea.repository.js";
import { eq } from "drizzle-orm";

export class IdeaModel implements IdeaRepository {
  constructor(private db: ReturnType<typeof drizzle>) { }

  async listIdeas(): Promise<z.infer<typeof listIdeaSchemaResBody>> {
    const ideas = await this.db.select().from(ideasTable);
    const ideasResponse: z.infer<typeof listIdeaSchemaResBody> = ideas.map(({ id, ...rest }) => ({
      ...rest,
    }));
    return ideasResponse;
  }

  async getIdea(slug: string): Promise<z.infer<typeof getIdeaSchemaResBody> | null> {
    const idea = await this.db.select().from(ideasTable).where(eq(ideasTable.slug, slug));
    if (!idea || idea.length === 0) {
      return null;
    }
    return idea[0];
  }
}
