import type { Express } from "express";

import { apiReference } from "@scalar/express-api-reference";
import swaggerUi from "swagger-ui-express";

import { generateOpenApiDocument } from "./generator.js";

export default function configureOpenAPI(app: Express) {
  // generate open api document
  const openApiDocument = generateOpenApiDocument();

  // serve open api document
  app.get("/api-docs/openapi.json", (req, res) => {
    res.json(openApiDocument);
  });

  // serve swagger ui
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

  // serve scalar ui
  app.use(
    "/reference",
    apiReference({
      spec: {
        url: "/api-docs/openapi.json",
      },
    }),
  );
}
