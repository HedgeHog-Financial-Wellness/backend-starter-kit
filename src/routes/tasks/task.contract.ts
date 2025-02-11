import { initContract } from "@ts-rest/core";

import { errorResponseSchema, successResponseSchema } from "@/common/zod-openapi-schema.js";

import { createTaskSchema, deleteTaskSchema, getTaskRequestPathParamSchema, patchTaskSchema, taskListSchema, taskSchema } from "./task.schema.js";

export const TaskContract = initContract().router({
  list: {
    method: "GET",
    path: "/",
    responses: {
      200: taskListSchema,
    },
    summary: "Get a list of tasks",
  },
  get: {
    method: "GET",
    path: "/:id",
    pathParams: getTaskRequestPathParamSchema,
    responses: {
      200: taskSchema,
      404: errorResponseSchema,
      422: errorResponseSchema,
    },
    summary: "Get a task",
  },
  create: {
    method: "POST",
    path: "/",
    body: createTaskSchema,
    responses: {
      200: taskSchema,
    },
    summary: "Create a task",
  },
  update: {
    method: "PATCH",
    path: "/:id",
    pathParams: getTaskRequestPathParamSchema,
    body: patchTaskSchema,
    responses: {
      200: taskSchema,
      404: errorResponseSchema,
      422: errorResponseSchema,
    },
    summary: "Update a task",
  },
  delete: {
    method: "DELETE",
    path: "/:id",
    pathParams: getTaskRequestPathParamSchema,
    body: deleteTaskSchema,
    responses: {
      204: successResponseSchema,
    },
    summary: "Delete a task",
  },
}, {
  pathPrefix: "/tasks",
  tags: ["tasks"],
});
