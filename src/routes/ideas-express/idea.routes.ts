import type { Request, Response } from "express";
import express from "express";

import { list } from "./idea.handler.js";

const ideasRouter = express.Router();

ideasRouter.get("/", list);


export default ideasRouter;