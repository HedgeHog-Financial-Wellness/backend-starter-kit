// src/common/zod-openapi-schema.ts: contains all the common zod schemas for the openapi documentation.

import { extendZodWithOpenApi } from "@anatine/zod-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const errorResponseSchema = z.object({
  message: z.string().openapi({
    description: "The error message",
  }),
}).openapi({
  title: "Error",
  description: "An error Schema",
});
export const successResponseSchema = z.object({
  message: z.string().openapi({
    description: "The success message",
  }),
}).openapi({
  title: "Success",
  description: "A success Schema",
});
