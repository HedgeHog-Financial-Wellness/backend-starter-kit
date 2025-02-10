import { initContract } from "@ts-rest/core";

import { errorResponseSchema, successResponseSchema } from "@/common/zod-openapi-schema.js";

import { createTaskSchemaReqBody, deleteTaskSchemaReqBody, getTaskRequestPathParamSchema, getTaskSchemaResBody, listTaskSchemaResBody, patchTaskSchemaReqBody } from "./task.schema.js";

export const TaskContract = initContract().router({
  list: {
    method: "GET",
    path: "/",
    responses: {
      200: listTaskSchemaResBody,
    },
    summary: "Get a list of tasks",
  },
  get: {
    method: "GET",
    path: "/:id",
    pathParams: getTaskRequestPathParamSchema,
    responses: {
      200: getTaskSchemaResBody,
      404: errorResponseSchema,
      422: errorResponseSchema,
    },
    summary: "Get a task",
  },
  create: {
    method: "POST",
    path: "/",
    body: createTaskSchemaReqBody,
    responses: {
      200: getTaskSchemaResBody,
      422: errorResponseSchema,
    },
    summary: "Create a task",
  },
  update: {
    method: "PATCH",
    path: "/:id",
    pathParams: getTaskRequestPathParamSchema,
    body: patchTaskSchemaReqBody,
    responses: {
      200: getTaskSchemaResBody,
      404: errorResponseSchema,
      422: errorResponseSchema,
    },
    summary: "Update a task",
  },
  delete: {
    method: "DELETE",
    path: "/:id",
    pathParams: getTaskRequestPathParamSchema,
    body: deleteTaskSchemaReqBody,
    responses: {
      204: successResponseSchema,
    },
    summary: "Delete a task",
  },
}, {
  pathPrefix: "/tasks",
});
