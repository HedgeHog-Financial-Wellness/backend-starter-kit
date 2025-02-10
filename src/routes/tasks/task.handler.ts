import type { ServerInferRequest, ServerInferResponses } from "@ts-rest/core";

import * as HTTP_STATUS_PHRASES from "@/common/http/http-status-phrases.js";

import type { TaskContract } from "./task.contract.js";
import type { TaskService } from "./task.service.js";

type ResponseShapes = ServerInferResponses<typeof TaskContract>;
type RequestShapes = ServerInferRequest<typeof TaskContract>;

export class TaskHandler {
  constructor(private taskService: TaskService) { }

  list = async (): Promise<ResponseShapes["list"]> => {
    const tasks = await this.taskService.list();
    return {
      status: 200 as const,
      body: tasks,
    };
  };

  create = async (request: RequestShapes["create"]): Promise<ResponseShapes["create"]> => {
    const task = request.body;
    const newTask = await this.taskService.create(task.name, task.done);
    return {
      status: 200 as const,
      body: newTask,
    };
  };

  get = async (request: RequestShapes["get"]): Promise<ResponseShapes["get"]> => {
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
  };

  update = async (request: RequestShapes["update"]): Promise<ResponseShapes["update"]> => {
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
  };

  delete = async (request: RequestShapes["delete"]): Promise<ResponseShapes["delete"]> => {
    await this.taskService.delete(Number(request.params.id));
    return {
      status: 200 as const,
      body: {
        message: "Task Deleted Successfully",
      },
    };
  };
}
