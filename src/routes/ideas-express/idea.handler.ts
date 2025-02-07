import type { z } from "zod";
import type { Request, Response } from "express";
import type { RouteHandler, TypedRequest, TypedResponse } from "@/lib/express-openapi.js";

import { db } from "@/db/index.js";
import { ideasTable } from "@/db/schema/ideas.js";
import { listIdeasZodSchemaResBody } from "./ideas.schema.js";
import type { ListRoute } from "./idea.routes.js";
export const list = async (req: Request, res: Response) => {
  const ideas = await db.select().from(ideasTable);
  const ideasResponse: Array<z.infer<typeof listIdeasZodSchemaResBody>> = ideas.map(({ id, ...rest }) => ({
    ...rest,
  }));
  res.json(ideasResponse);
}

export const listRt: RouteHandler<ListRoute> = async (req: TypedRequest<ListRoute>, res: TypedResponse<ListRoute>) => {
  const ideas = await db.select().from(ideasTable);
  const ideasResponse: Array<z.infer<typeof listIdeasZodSchemaResBody>> = ideas.map(({ id, ...rest }) => ({
    ...rest,
  }));
  res.json(ideasResponse);
}
