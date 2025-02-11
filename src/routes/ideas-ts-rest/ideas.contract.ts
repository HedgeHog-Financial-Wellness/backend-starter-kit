import { initContract } from "@ts-rest/core";

import { errorResponseSchema } from "@/common/zod-openapi-schema.js";

import { getIdeaRequestSchema, getIdeaSchemaResBody, listIdeaSchemaResBody } from "./ideas.schema.js";

export const ideasContract = initContract().router({
  list: {
    method: "GET",
    path: `/`,
    responses: {
      200: listIdeaSchemaResBody,
    },
    summary: "Get a list of ideas",
  },
  get: {
    method: "GET",
    path: `/:slug`,
    pathParams: getIdeaRequestSchema,
    responses: {
      200: getIdeaSchemaResBody,
      404: errorResponseSchema,
    },
    summary: "Get a single idea",
  },
}, {
  pathPrefix: "/ideas",
  tags: ["ideas"],
});
