import { createRoute, z } from "@hono/zod-openapi";

import { createTaskSchema, patchTaskSchema, selectTasksSchema } from "@/db/schema.js";
import * as HTTP_STATUS_CODES from "@/framework/hono/http-status-codes.js";
import jsonContentOneOf from "@/framework/hono/openapi/helpers/json-content-one-of.js";
import jsonContentRequired from "@/framework/hono/openapi/helpers/json-content-required.js";
import jsonContent from "@/framework/hono/openapi/helpers/json-content.js";
import createErrorSchema from "@/framework/hono/openapi/schemas/create-error-schema.js";
import IdParamsSchema from "@/framework/hono/openapi/schemas/id-params.js";
import { notFoundSchema } from "@/lib/constant.js";

const tags = ["Tasks"];

const list = createRoute({
  path: "/tasks",
  method: "get",
  tags,
  responses: {
    [HTTP_STATUS_CODES.OK]: jsonContent(
      z.array(selectTasksSchema),
      "the list of tasks",
    ),
  },
});

export type ListRoute = typeof list;

const create = createRoute({
  path: "/tasks",
  method: "post",
  tags,
  request: {
    body: jsonContentRequired(createTaskSchema, "The task to create"),
  },
  responses: {
    [HTTP_STATUS_CODES.OK]: jsonContent(selectTasksSchema, "The created task"),
    [HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(createTaskSchema),
      "validation error",
    ),
  },
});

export type CreateRoute = typeof create;

const getOne = createRoute({
  path: "/tasks/{id}",
  method: "get",
  tags,
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HTTP_STATUS_CODES.OK]: jsonContent(selectTasksSchema, "The task"),
    [HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid ID validation error",
    ),
    [HTTP_STATUS_CODES.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Task not found",
    ),
  },
});

export type GetOneRoute = typeof getOne;

const patch = createRoute({
  path: "/tasks/{id}",
  method: "patch",
  tags,
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(patchTaskSchema, "The task to update"),
  },
  responses: {
    [HTTP_STATUS_CODES.OK]: jsonContent(selectTasksSchema, "The updated task"),
    [HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY]: jsonContentOneOf(
      [
        createErrorSchema(patchTaskSchema),
        createErrorSchema(IdParamsSchema),
      ],
      "validation error",
    ),
    [HTTP_STATUS_CODES.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Task not found",
    ),
  },
});

export type PatchRoute = typeof patch;

const deleteOne = createRoute({
  path: "/tasks/{id}",
  method: "delete",
  tags,
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HTTP_STATUS_CODES.NO_CONTENT]: {
      description: "Task deleted",
    },
    [HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid ID validation error",
    ),
    [HTTP_STATUS_CODES.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Task not found",
    ),
  },
});

export type DeleteOneRoute = typeof deleteOne;

export { create, deleteOne, getOne, list, patch };
