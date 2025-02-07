import type { Request, Response } from "express";
import express from "express";

import { list } from "./idea.handler.js";
import { createRoute, z } from "@/lib/express-openapi-cursor.js";
import { listIdeasZodSchemaResBody } from "./ideas.schema.js";

const ideasRouter = express.Router();

ideasRouter.get("/", list);


export default ideasRouter;



const listRt = createRoute({
  method: "get",
  path: "/ideas",
  tags: ["Ideas"],
  responses: {
    200: {
      description: "List of ideas",
      content: {
        "application/json": {
          schema: z.array(listIdeasZodSchemaResBody),
        },
      },
    },
  },
});

export type ListRoute = typeof listRt;