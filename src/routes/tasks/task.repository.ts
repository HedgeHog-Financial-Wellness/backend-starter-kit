import type { Task, UpdateTask } from "./task.schema.js";

export interface TaskRepository {
  list: () => Promise<Task[]>;
  get: (id: number) => Promise<Task | null>;
  create: (name: string, done: boolean) => Promise<Task>;
  update: (id: number, task: UpdateTask) => Promise<Task>;
  delete: (id: number) => Promise<void>;
}
