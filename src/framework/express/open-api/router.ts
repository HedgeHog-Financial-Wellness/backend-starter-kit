import express, { type Request, type Response, type Router } from "express";
import swaggerUi from "swagger-ui-express";

import { generateOpenAPIDocument } from "./generator.js";
import { listIdeasRegistry } from "@/routes/ideas-express/ideas.schema.js";


export const openAPIRouter: Router = express.Router();
// WIP: here all the registries are added
const openAPIDocument = generateOpenAPIDocument([listIdeasRegistry]);

openAPIRouter.get("/swagger.json", (_req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");
  res.send(openAPIDocument);
});

openAPIRouter.use("/", swaggerUi.serve, swaggerUi.setup(openAPIDocument));