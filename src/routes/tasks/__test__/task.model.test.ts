import { afterAll, beforeAll, describe, expect, it } from "vitest";

import dbInstance from "@/db/index.js";
import { tasksTable } from "@/db/schema/tasks.js";

import { TaskModel } from "../task.model.js";

const { db } = dbInstance;
let taskModel: TaskModel;
const { seedTasks, deleteTasks } = helperFunction();

describe("test without seed", () => {
  beforeAll(async () => {
    taskModel = new TaskModel(db);
  });
  it("should list zero tasks", async () => {
    const tasks = await taskModel.list();
    expect(tasks).toBeDefined();
    expect(tasks.length).toBe(0);
  });

  it("should return null when get a non-existent task", async () => {
    const task = await taskModel.get(999);
    expect(task).toBeNull();
  });

  it("should throw an error when update a non-existent task", async () => {
    await expect(taskModel.update(999, { name: "Test Task", done: false })).rejects.toThrow();
  });

  it("should throw an error when delete a non-existent task", async () => {
    await expect(taskModel.delete(999)).rejects.toThrow();
  });
});

describe("task Model", () => {
  beforeAll(async () => {
    taskModel = new TaskModel(db);
    await seedTasks();
  });

  afterAll(async () => {
    await deleteTasks();
  });

  it("should list tasks", async () => {
    const tasks = await taskModel.list();
    expect(tasks).toBeDefined();
    expect(tasks.length).toBe(3);
  });

  it("should get a task", async () => {
    const taskList = await taskModel.list();
    expect(taskList.length).toBeGreaterThan(0);
    const task = await taskModel.get(taskList[0].id);
    expect(task).toBeDefined();
    expect(task?.name).toBe(taskList[0].name);
    expect(task?.done).toBe(taskList[0].done);
  });

  it("should update a task", async () => {
    const taskList = await taskModel.list();
    expect(taskList.length).toBeGreaterThan(0);
    const task = await taskModel.update(taskList[0].id, { name: "Updated Task", done: true });
    expect(task).toBeDefined();
    expect(task.name).toBe("Updated Task");
    expect(task.done).toBe(true);
  });

  it("should create a task", async () => {
    const task = await taskModel.create("Test-Task-999", false);
    expect(task).toBeDefined();
    expect(task.name).toBe("Test-Task-999");
    expect(task.done).toBe(false);
  });

  it("should delete a task", async () => {
    const taskList = await taskModel.list();
    expect(taskList.length).toBeGreaterThan(0);
    await taskModel.delete(taskList[0].id);
    const task = await taskModel.get(taskList[0].id);
    expect(task).toBeNull();
  });
});

function helperFunction() {
  const dummyTaskList = [
    { name: "Test Task 1", done: false },
    { name: "Test Task 2", done: true },
    { name: "Test Task 3", done: false },
  ];

  const seedTasks = async () => {
    await db.insert(tasksTable).values(dummyTaskList);
  };

  const deleteTasks = async () => {
    await db.delete(tasksTable);
  };

  return { seedTasks, deleteTasks };
}
