import type { z } from "zod";

import { nanoid } from "nanoid";

import type { createIdeaSchemaResBody, listIdeasSchemaResBody } from "@/db/schema/ideas.js";
import type { AppRouteHandler } from "@/lib/types.js";

import {db} from "@/db/index.js";
import { ideasTable } from "@/db/schema/ideas.js";
import * as HTTP_STATUS_CODES from "@/framework/hono/http-status-codes.js";

import type { CreateRoute, ListRoute } from "./idea.routes.js";

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const idea = c.req.valid("json");

  const dbIdeaEntry: typeof ideasTable.$inferInsert = {
    title: idea.title,
    description: idea.description,
    slug: nanoid(8),
  };

  const [newIdea] = await db.insert(ideasTable).values(dbIdeaEntry).returning();

  const ideaResponse: z.infer<typeof createIdeaSchemaResBody> = {
    title: newIdea.title,
    description: newIdea.description,
    slug: newIdea.slug,
    status: newIdea.status,
  };
  return c.json(ideaResponse, HTTP_STATUS_CODES.OK);
};

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const ideas = await db.select().from(ideasTable);
  const ideasResponse: Array<z.infer<typeof listIdeasSchemaResBody>> = ideas.map(({ id, ...rest }) => ({
    ...rest,
  }));
  return c.json(ideasResponse, HTTP_STATUS_CODES.OK);
};
