import type { TaskRepository } from "./task.repository.js";
import type { Task, UpdateTask } from "./task.schema.js";

export class TaskService {
  constructor(private taskRepository: TaskRepository) { }

  async list(): Promise<Task[]> {
    return await this.taskRepository.list();
  };

  async create(name: string, done: boolean): Promise<Task> {
    return await this.taskRepository.create(name, done);
  };

  async get(taskId: number): Promise<Task | null> {
    return await this.taskRepository.get(taskId);
  };

  async update(taskId: number, updates: UpdateTask): Promise<Task> {
    return await this.taskRepository.update(taskId, updates);
  };

  async delete(taskId: number): Promise<void> {
    await this.taskRepository.delete(taskId);
  };
}
