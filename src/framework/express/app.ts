import type { Express } from "express";

import express from "express";

export function createApp() {
  const app: Express = express();

  app.use(express.json());

  app.get("/", (req, res) => {
    res.send("Hello World");
  });

  return app;
}
