import { extendZodWithOpenApi } from "@anatine/zod-openapi";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { tasksTable } from "../../db/schema/tasks.js";

extendZodWithOpenApi(z);

export const getTaskSchemaResBody = createSelectSchema(tasksTable).openapi({
  title: "Task",
  description: "A task Schema",
});

export const getTaskRequestPathParamSchema = z.object({
  id: z.string().uuid(),
});

export const listTaskSchemaResBody = z.array(getTaskSchemaResBody).openapi({
  title: "Task List",
  description: "A list of tasks",
});

export const createTaskSchemaReqBody = createInsertSchema(tasksTable, {
  name: schema => schema.min(1).max(500),
})
  .required({
    done: true,
  })
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  });

export const patchTaskSchemaReqBody = createTaskSchemaReqBody.partial();

export const deleteTaskSchemaReqBody = z.object({});

export type Task = z.infer<typeof getTaskSchemaResBody>;
export type UpdateTask = z.infer<typeof patchTaskSchemaReqBody>;
