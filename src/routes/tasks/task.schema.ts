import { extendZodWithOpenApi } from "@anatine/zod-openapi";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod";

import { tasksTable } from "../../db/schema/tasks.js";

extendZodWithOpenApi(z);

export const taskSchema = createSelectSchema(tasksTable).openapi({
  title: "Task",
  description: "A task Schema",
});

export const getTaskRequestPathParamSchema = z.object({
  id: z.coerce.number(),
});

export const taskListSchema = z.array(taskSchema).openapi({
  title: "Task List",
  description: "A list of tasks",
});

export const createTaskSchema = createInsertSchema(tasksTable, {
  name: z.string().min(1).max(500),
})
  .required({
    name: true,
    done: true,
  })
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  });

export const patchTaskSchema = createUpdateSchema(tasksTable, {
  name: z.string().min(1).max(500),
  done: z.boolean(),
}).partial();

export const deleteTaskSchema = z.object({});

export type Task = z.infer<typeof taskSchema>;
export type UpdateTask = z.infer<typeof patchTaskSchema>;
