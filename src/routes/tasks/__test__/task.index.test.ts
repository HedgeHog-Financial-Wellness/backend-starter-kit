import type { drizzle } from "drizzle-orm/node-postgres";
import type { Express } from "express";

import express from "express";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import dbInstance from "@/db/index.js";
import { tasksTable } from "@/db/schema/tasks.js";

import { configureTasksEndpoints } from "../tasks.index.js";

function createTestApp() {
  const { db } = dbInstance;
  const app = express();
  app.use(express.json());
  // configure endpoints
  configureTasksEndpoints(db, app);

  return app;
}

let app: Express;

describe("tasks", () => {
  beforeAll(() => {
    app = createTestApp();
  });

  afterAll(async () => {
    await helperDeleteAllTasks(dbInstance.db);
    dbInstance.disconnect();
  });

  // list
  it("should return 200", async () => {
    const response = await request(app).get("/tasks");
    expect(response.status).toBe(200);
  });

  // get
  it("should return 404", async () => {
    const response = await request(app).get("/tasks/1");
    expect(response.status).toBe(404);
  });

  it("should return 400", async () => {
    const response = await request(app).get("/tasks/ewfasd");
    expect(response.status).toBe(400);
  });

  // create
  it("should return 200 with valid data", async () => {
    const response = await request(app).post("/tasks").send({ name: "test", done: false });
    expect(response.status).toBe(200);
  });

  it("should return 400 with invalid data", async () => {
    const response = await request(app).post("/tasks").send({ nadame: "", done: false });
    expect(response.status).toBe(400);
  });
});

async function helperDeleteAllTasks(db: ReturnType<typeof drizzle>) {
  await db.delete(tasksTable).execute();
}
