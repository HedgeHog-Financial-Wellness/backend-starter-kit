import type { drizzle } from "drizzle-orm/node-postgres";

import { eq } from "drizzle-orm";

import { tasksTable } from "@/db/schema/tasks.js";

import type { TaskRepository } from "./task.repository.js";
import type { Task, UpdateTask } from "./task.schema.js";

const errTaskCreationFailed = new Error("Unable to create task");
const errTaskUpdateFailed = new Error("Unable to update task");
const errTaskDeleteFailed = new Error("Unable to delete task");

export class TaskModel implements TaskRepository {
  constructor(private db: ReturnType<typeof drizzle>) { }

  async list(): Promise<Task[]> {
    const dbTasks = await this.db.select().from(tasksTable);
    if (!dbTasks) {
      return [];
    }

    return dbTasks.map(task => ({
      id: task.id,
      name: task.name,
      done: task.done,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    })) as Task[];
  }

  async get(id: number): Promise<Task | null> {
    const [task] = await this.db.select().from(tasksTable).where(eq(tasksTable.id, id));
    if (!task) {
      return null;
    }
    return {
      id: task.id,
      name: task.name,
      done: task.done,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    } as Task;
  }

  async create(name: string, done: boolean): Promise<Task> {
    const dbTask: typeof tasksTable.$inferInsert = {
      name,
      done,
    };
    const result = await this.db.insert(tasksTable).values(dbTask).returning();
    if (result.length === 0) {
      throw errTaskCreationFailed;
    }

    return {
      id: result[0].id,
      name: result[0].name,
      done: result[0].done,
      createdAt: result[0].createdAt,
      updatedAt: result[0].updatedAt,
    } as Task;
  }

  async update(id: number, task: UpdateTask): Promise<Task> {
    const result = await this.db.update(tasksTable).set(task).where(eq(tasksTable.id, id)).returning();
    if (result.length === 0) {
      throw errTaskUpdateFailed;
    }
    return result[0];
  }

  async delete(id: number): Promise<void> {
    const result = await this.db.delete(tasksTable).where(eq(tasksTable.id, id));
    if (result.rowCount === 0) {
      throw errTaskDeleteFailed;
    }
  }
}
