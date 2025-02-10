import { describe, it, expect } from "vitest";
import db from "./index.js";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
describe("db", () => {
  it("db should not be null", async () => {
    expect(db.db).not.toBeNull();
  });

  it("connect should return a db instance", async () => {
    const version = await dbVersionHelper(db.db);
    expect(version).toBeDefined();
    await db.disconnect();
  });
});


const dbVersionHelper = async (db: ReturnType<typeof drizzle>): Promise<string> => {
  const result = await db.execute(sql`SELECT version() as version`);
  if (result.rows.length === 0 || !result.rows[0].version) {
    throw new Error("db version not found");
  }
  return result.rows[0].version as string;
};
