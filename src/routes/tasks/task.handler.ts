import type { ServerInferRequest, ServerInferResponses } from "@ts-rest/core";

import { trace } from "@opentelemetry/api";

import * as HTTP_STATUS_PHRASES from "@/common/http/http-status-phrases.js";

import type { TaskContract } from "./task.contract.js";
import type { TaskService } from "./task.service.js";
import { startActiveSpan } from "@/common/instrument/index.js";
type ResponseShapes = ServerInferResponses<typeof TaskContract>;
type RequestShapes = ServerInferRequest<typeof TaskContract>;

export class TaskHandler {
  constructor(private taskService: TaskService) { }

  list = async (): Promise<ResponseShapes["list"]> => {
    return startActiveSpan("list-tasks-handler", async () => {
      const tasks = await this.taskService.list();
      return {
        status: 200 as const,
        body: tasks,
      };
    });
  };

  create = async (request: RequestShapes["create"]): Promise<ResponseShapes["create"]> => {
    return startActiveSpan("create-task-handler", async () => {
      const task = request.body;
      const newTask = await this.taskService.create(task.name, task.done);
      return {
        status: 200 as const,
        body: {
          id: newTask.id,
          name: newTask.name,
          done: newTask.done,
          createdAt: newTask.createdAt,
          updatedAt: newTask.updatedAt,
        } as ResponseShapes["create"]["body"],
      } as ResponseShapes["create"];
    });
  };

  get = async (request: RequestShapes["get"]): Promise<ResponseShapes["get"]> => {
    return startActiveSpan("get-task-handler", async () => {
      const task = await this.taskService.get(Number(request.params.id));
      if (!task) {
        return {
          status: 404 as const,
          body: {
            message: HTTP_STATUS_PHRASES.NOT_FOUND,
          },
        };
      }
      return {
        status: 200 as const,
        body: task,
      };
    });
  };

  update = async (request: RequestShapes["update"]): Promise<ResponseShapes["update"]> => {
    return startActiveSpan("update-task-handler", async () => {
      const id = Number(request.params.id);
      const updates = request.body;
      const updatedTask = await this.taskService.update(id, updates);
      if (!updatedTask) {
        return {
          status: 404 as const,
          body: {
            message: HTTP_STATUS_PHRASES.NOT_FOUND,
          },
        };
      }
      return {
        status: 200 as const,
        body: updatedTask,
      };
    });
  };

  delete = async (request: RequestShapes["delete"]): Promise<ResponseShapes["delete"]> => {
    return startActiveSpan("delete-task-handler", async () => {
      await this.taskService.delete(Number(request.params.id));
      return {
        status: 200 as const,
        body: {
          message: "Task Deleted Successfully",
        },
      };
    });
  };
}
