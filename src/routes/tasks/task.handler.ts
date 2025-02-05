import { eq } from "drizzle-orm";

import type { AppRouteHandler } from "@/lib/types.js";

import db from "@/db/index.js";
import { tasksTable } from "@/db/schema/tasks.js";
import * as HTTP_STATUS_CODES from "@/framework/hono/http-status-codes.js";
import * as HTTP_STATUS_PHRASES from "@/framework/hono/http-status-phrases.js";

import type {
  CreateRoute,
  DeleteOneRoute,
  GetOneRoute,
  ListRoute,
  PatchRoute,
} from "./task.routes.js";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const tasks = await db.select().from(tasksTable);
  c.var.logger.info("Listing tasks");
  return c.json(tasks);
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const task = c.req.valid("json");
  const [newTask] = await db.insert(tasksTable).values(task).returning();
  return c.json(newTask, HTTP_STATUS_CODES.OK);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const [task] = await db.select()
    .from(tasksTable)
    .where(eq(tasksTable.id, Number(c.req.param("id"))));

  if (!task) {
    return c.json({ message: "Task not found" }, HTTP_STATUS_CODES.NOT_FOUND);
  }

  return c.json(task, HTTP_STATUS_CODES.OK);
};

export const patch: AppRouteHandler<PatchRoute> = async (c) => {
  const id = Number(c.req.param("id"));
  const updates = c.req.valid("json");
  const [updatedTask] = await db
    .update(tasksTable)
    .set(updates)
    .where(eq(tasksTable.id, id))
    .returning();
  if (!updatedTask) {
    return c.json(
      { message: HTTP_STATUS_PHRASES.NOT_FOUND },
      HTTP_STATUS_CODES.NOT_FOUND,
    );
  }
  return c.json(updatedTask, HTTP_STATUS_CODES.OK);
};

export const deleteOne: AppRouteHandler<DeleteOneRoute> = async (c) => {
  const id = Number(c.req.param("id"));
  const result = await db.delete(tasksTable).where(eq(tasksTable.id, id));
  if (!result.rowCount || result.rowCount === 0) {
    return c.json(
      { message: HTTP_STATUS_PHRASES.NOT_FOUND },
      HTTP_STATUS_CODES.NOT_FOUND,
    );
  }
  return c.body(null, HTTP_STATUS_CODES.NO_CONTENT);
};
