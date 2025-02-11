import type { drizzle } from "drizzle-orm/node-postgres";
import type express from "express";

import { createExpressEndpoints, initServer } from "@ts-rest/express";

import { IdeaHandler } from "./idea.handler.js";
import { IdeaModel } from "./idea.model.js";
import { IdeaService } from "./idea.service.js";
import { ideasContract } from "./ideas.contract.js";

export function configureIdeasEndpoints(db: ReturnType<typeof drizzle>, app: express.Application) {
  const ideaModel = new IdeaModel(db);
  const ideaService = new IdeaService(ideaModel);
  const ideaHandler = new IdeaHandler(ideaService);
  const s = initServer();
  const ideasRouter = s.router(ideasContract, {
    list: ideaHandler.listIdeas.bind(ideaHandler),
    get: ideaHandler.getIdea.bind(ideaHandler),
  });

  createExpressEndpoints(ideasContract, ideasRouter, app);
}
