import { type Express } from "express";
import swaggerUi from "swagger-ui-express";
import { configureOpenApi } from "./generator.js";
export const configureSwaggerUi = (app: Express) => {
  const openApiDocument = configureOpenApi();
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));
}

