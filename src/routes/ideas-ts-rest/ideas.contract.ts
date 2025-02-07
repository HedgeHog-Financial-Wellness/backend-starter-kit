
import { initContract } from '@ts-rest/core';

import { listIdeaSchemaResBody, getIdeaRequestSchema, errorResponseSchema, getIdeaSchemaResBody } from "./ideas.schema.js";

const c = initContract();
export const ideasContract = c.router({
  list: {
    method: 'GET',
    path: `/`,
    responses: {
      200: listIdeaSchemaResBody,
    },
    summary: 'Get a list of ideas',
  },
  get: {
    method: 'GET',
    path: `/:slug`,
    pathParams: getIdeaRequestSchema,
    responses: {
      200: getIdeaSchemaResBody,
      404: errorResponseSchema,
    },
    summary: 'Get a single idea',
  },
}, {
  pathPrefix: '/ideas',
});