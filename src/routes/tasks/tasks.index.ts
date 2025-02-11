import type { drizzle } from "drizzle-orm/node-postgres";
import type { Application } from "express";

import { createExpressEndpoints, initServer } from "@ts-rest/express";

import { TaskContract } from "./task.contract.js";
import { TaskHandler } from "./task.handler.js";
import { TaskModel } from "./task.model.js";
import { TaskService } from "./task.service.js";

export function configureTasksEndpoints(db: ReturnType<typeof drizzle>, app: Application) {
  const taskModel = new TaskModel(db);
  const taskService = new TaskService(taskModel);
  const taskHandler = new TaskHandler(taskService);
  const s = initServer();
  const tasksRouter = s.router(TaskContract, {
    list: taskHandler.list.bind(taskHandler),
    get: taskHandler.get.bind(taskHandler),
    create: taskHandler.create.bind(taskHandler),
    update: taskHandler.update.bind(taskHandler),
    delete: taskHandler.delete.bind(taskHandler),
  });

  createExpressEndpoints(TaskContract, tasksRouter, app);
}
