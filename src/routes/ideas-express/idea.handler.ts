import type { z } from "zod";
import type { Request, Response } from "express";

import { db } from "@/db/index.js";
import { ideasTable } from "@/db/schema/ideas.js";
import { listIdeasSchemaResBody } from "./ideas.schema.js";

export async function list(req: Request, res: Response){
  const ideas = await db.select().from(ideasTable);
  const ideasResponse: Array<z.infer<typeof listIdeasSchemaResBody>> = ideas.map(({ id, ...rest }) => ({
    ...rest,
  }));
  res.json(ideasResponse);
}
