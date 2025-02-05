import { describe, expect, it } from "vitest";

import { createTestApp } from "@/lib/create-app.js";

import router from "./tasks.index.js";

describe("tasks List", () => {
  it("should return a list of tasks", async () => {
    const testApp = createTestApp(router);
    const response = await testApp.request("/tasks");
    const result = await response.json ();
    expect(response.status).toBe(200);
    expect(result).toBeInstanceOf(Array);
  });

  it("should return a list of tasks: again:> using test client", async () => {
    const testApp = createTestApp(router);
    const response = await testApp.request("/tasks");
    const result = await response.json();
    expect(response.status).toBe(200);
    expect(result).toBeInstanceOf(Array);
  });
});
