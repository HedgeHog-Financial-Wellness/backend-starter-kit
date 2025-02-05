import { describe, expect, it } from "vitest";

import { createTestApp } from "@/lib/create-app.js";

import router from "./idea.index.js";

describe("ideas creation", () => {
  it("should create an idea", async () => {
    const testApp = createTestApp(router);
    const response = await testApp.request("/ideas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "Test Idea",
        description: "This is a test idea",
      }),
    });
    const result = await response.json();
    expect(response.status).toBe(200);
    expect(result).toBeInstanceOf(Object);
    expect(result.title).toBe("Test Idea");
    expect(result.description).toBe("This is a test idea");
    expect(result.status).toBe("draft");
    expect(result.slug).toBeDefined();
    expect(result.slug).toHaveLength(8);
  });
});

describe("ideas listing", () => {
  it("should list ideas", async () => {
    const testApp = createTestApp(router);
    const response = await testApp.request("/ideas", {
      method: "GET",
    });
    const result = await response.json();
    expect(response.status).toBe(200);
    expect(result).toBeInstanceOf(Array);
  });
});
