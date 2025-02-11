# Adding a New Route

### Step-by-Step Guidelines for Adding a New Route to the Project

**e.g. :** `project` domain entity is added.

0. **Create Database Schema**:
  create a new schema under `src/db/schema` folder.

1. **Create the Folder Structure**:
    - Create a new folder under `src/routes/` for the new route. For example, if the new route is for "projects", create `src/routes/projects/`.

2. **Define the API Contract**:
    - Create a file named `project.contract.ts` in the new folder.
    - Define the API endpoints using `@ts-rest/core`.

    ```typescript
    import { initContract } from '@ts-rest/core';
    import { projectListSchema, projectSchema, createProjectSchema, patchProject, getProjectRequestPathParamSchema } from "./project.schema.js";
    import { errorResponseSchema } from "@/common/zod-openapi-schema.js";

    export const projectsContract = initContract().router({
      list: {
        method: "GET",
        path: "/",
        responses: {
          200: projectListSchema,
        },
        summary: 'Get a list of projects',
      },
      get: {
        method: "GET",
        path: "/:id",
        pathParams: getProjectRequestPathParamSchema,
        responses: {
          200: projectSchema,
          404: errorResponseSchema,
        },
        summary: 'Get a project',
      },
      create: {
        method: "POST",
        path: "/",
        body: createProjectSchema,
        responses: {
          200: projectSchema,
          422: errorResponseSchema,
        },
        summary: 'Create a project',
      },
      update: {
        method: "PATCH",
        path: "/:id",
        pathParams: getProjectRequestPathParamSchema,
        body: patchProject,
        responses: {
          200: projectSchema,
          404: errorResponseSchema,
          422: errorResponseSchema,
        },
        summary: 'Update a project',
      },
      delete: {
        method: "DELETE",
        path: "/:id",
        pathParams: getProjectRequestPathParamSchema,
        responses: {
          200: getProjectSchemaResBody,
          404: errorResponseSchema,
          422: errorResponseSchema,
        },
        summary: 'Delete a project',
      },
    }, {
      pathPrefix: '/projects',
    });
    ```
  **NOTE**: the above schema are extended open api zod schema created in the `project.schema.ts` file.

3. **Define the Data Validation Schemas**:
    - Create a file named `project.schema.ts` in the new folder.
    - Define the data validation schemas using `zod`.
    - The zod root schema is created from drizzle schema using `drizzle-zod` package.

    ```typescript
  import { extendZodWithOpenApi } from "@anatine/zod-openapi";
  import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
  import { z } from "zod";

  import { projectTable } from "../../db/schema/project.js";

  extendZodWithOpenApi(z);

  export const projectSchema = createSelectSchema(projectTable).openapi({
    title: "Project",
    description: "A project Schema",
  });

  export const getProjectRequestPathParamSchema = z.object({
    id: z.coerce.number(),
  });

  export const projectListSchema = z.array(projectSchema).openapi({
    title: "Project List",
    description: "A list of projects",
  });

  export const createProjectSchema = createInsertSchema(projectTable, {
    name: z.string().min(1).max(500),
  })
    .required({
      name: true,
      done: true,
    })
    .omit({
      id: true,
      createdAt: true,
      updatedAt: true,
    });

  export const patchProjectSchema = createUpdateSchema(projectTable, {
    name: z.string().min(1).max(500),
    done: z.boolean(),
  }).partial();

  export const deleteProjectSchema = z.object({});

  export type Project = z.infer<typeof projectSchema>;
  export type UpdateProject = z.infer<typeof patchTaskSchema>;
    ```

2. **Create the Repository Interface**:
    - Create a file named `project.repository.ts` in the new folder.
    - Define the interface for data access methods.

    ```typescript
    import type { Project, UpdateProject } from "./task.schema.js";

  export interface ProjectRepository {
    list: () => Promise<Project[]>;
    get: (id: number) => Promise<Project | null>;
    create: (name: string, done: boolean) => Promise<Project>;
    update: (id: number, task: ProjectTask) => Promise<Project>;
    delete: (id: number) => Promise<void>;
  }

    ```

3. **Implement the Data Model**:
    - Create a file named `project.model.ts` in the new folder.
    - Implement the data model that interacts with the database.

    ```typescript
  import type { drizzle } from "drizzle-orm/node-postgres";

  import { eq } from "drizzle-orm";

  import { projectsTable } from "@/db/schema/projects.js";

  import type { ProjectRepository } from "./project.repository.js";
  import type { Project, UpdateProject } from "./project.schema.js";

  const errProjectCreationFailed = new Error("Unable to create project");
  const errProjectUpdateFailed = new Error("Unable to update project");
  const errProjectDeleteFailed = new Error("Unable to delete project");

  export class ProjectModel implements ProjectRepository {
    constructor(private db: ReturnType<typeof drizzle>) { }

    async list(): Promise<Project[]> {
      const dbProjects = await this.db.select().from(projectsTable);
      if (!dbProjects) {
        return [];
      }

      return dbProjects.map(project => ({
        id: project.id,
        name: project.name,
        done: project.done,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      })) as Project[];
    }

    async get(id: number): Promise<Project | null> {
      const [project] = await this.db.select().from(projectsTable).where(eq(projectsTable.id, id));
      if (!project) {
        return null;
      }
      return {
        id: project.id,
        name: project.name,
        done: project.done,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      } as Project;
    }

    async create(name: string, done: boolean): Promise<Project> {
      const dbProject: typeof projectsTable.$inferInsert = {
        name,
        done,
      };
      const result = await this.db.insert(projectsTable).values(dbProject).returning();
      if (result.length === 0) {
        throw errProjectCreationFailed;
      }

      return {
        id: result[0].id,
        name: result[0].name,
        done: result[0].done,
        createdAt: result[0].createdAt,
        updatedAt: result[0].updatedAt,
      } as Project;
    }

    async update(id: number, project: UpdateProject): Promise<Project> {
      const result = await this.db.update(projectsTable).set(project).where(eq(projectsTable.id, id)).returning();
      if (result.length === 0) {
        throw errProjectUpdateFailed;
      }
      return result[0];
    }

    async delete(id: number): Promise<void> {
      const result = await this.db.delete(projectsTable).where(eq(projectsTable.id, id));
      if (result.rowCount === 0) {
        throw errProjectDeleteFailed;
      }
    }
  }
    ```

4. **Implement the Service Layer**:
    - Create a file named `project.service.ts` in the new folder.
    - Implement the business logic that interacts with the repository.

    ```typescript
  import type { ProjectRepository } from "./project.repository.js";
  import type { Project, UpdateProject } from "./project.schema.js";

  export class ProjectService {
    constructor(private projectRepository: ProjectRepository) { }

    async list(): Promise<Project[]> {
      return await this.projectRepository.list();
    };

    async create(name: string, done: boolean): Promise<Project> {
      return await this.projectRepository.create(name, done);
    };

    async get(projectId: number): Promise<Project | null> {
      return await this.projectRepository.get(projectId);
    };

    async update(projectId: number, updates: UpdateProject): Promise<Project> {
      return await this.projectRepository.update(projectId, updates);
    };

    async delete(projectId: number): Promise<void> {
      await this.projectRepository.delete(projectId);
    };
  }
    ```

5. **Implement the Handler**:
    - Create a file named `project.handler.ts` in the new folder.
    - Implement the handler that processes HTTP requests and responses.

  ```ts
  import type { ServerInferRequest, ServerInferResponses } from "@ts-rest/core";

  import * as HTTP_STATUS_PHRASES from "@/common/http/http-status-phrases.js";

  import type { ProjectContract } from "./project.contract.js";
  import type { ProjectService } from "./project.service.js";

  type ResponseShapes = ServerInferResponses<typeof ProjectContract>;
  type RequestShapes = ServerInferRequest<typeof ProjectContract>;

  export class ProjectHandler {
    constructor(private projectService: ProjectService) { }

    list = async (): Promise<ResponseShapes["list"]> => {
      const projects = await this.projectService.list();
      return {
        status: 200 as const,
        body: projects,
      };
    };

    create = async (request: RequestShapes["create"]): Promise<ResponseShapes["create"]> => {
      const project = request.body;
      const newProject = await this.projectService.create(project.name, project.done);
      return {
        status: 200 as const,
        body: {
          id: newProject.id,
          name: newProject.name,
          done: newProject.done,
          createdAt: newProject.createdAt,
          updatedAt: newProject.updatedAt,
        } as ResponseShapes["create"]["body"],
      } as ResponseShapes["create"];
    };

    get = async (request: RequestShapes["get"]): Promise<ResponseShapes["get"]> => {
      const project = await this.projectService.get(Number(request.params.id));

      if (!project) {
        return {
          status: 404 as const,
          body: {
            message: HTTP_STATUS_PHRASES.NOT_FOUND,
          },
        };
      }

      return {
        status: 200 as const,
        body: project,
      };
    };

    update = async (request: RequestShapes["update"]): Promise<ResponseShapes["update"]> => {
      const id = Number(request.params.id);
      const updates = request.body;
      const updatedProject = await this.projectService.update(id, updates);
      if (!updatedProject) {
        return {
          status: 404 as const,
          body: {
            message: HTTP_STATUS_PHRASES.NOT_FOUND,
          },
        };
      }
      return {
        status: 200 as const,
        body: updatedProject,
      };
    };

    delete = async (request: RequestShapes["delete"]): Promise<ResponseShapes["delete"]> => {
      await this.projectService.delete(Number(request.params.id));
      return {
        status: 200 as const,
        body: {
          message: "Project Deleted Successfully",
        },
      };
    };
  }
  ```

6. **Configure the Routes**:
    - Create a file named `projects.index.ts` in the new folder.
    - Configure and initialize the routes.

    ```typescript
  import type { drizzle } from "drizzle-orm/node-postgres";
  import type { Application } from "express";

  import { createExpressEndpoints, initServer } from "@ts-rest/express";

  import { ProjectContract } from "./project.contract.js";
  import { ProjectHandler } from "./project.handler.js";
  import { ProjectModel } from "./project.model.js";
  import { ProjectService } from "./project.service.js";

  export function configureProjectsEndpoints(db: ReturnType<typeof drizzle>, app: Application) {
    const projectModel = new ProjectModel(db);
    const projectService = new ProjectService(projectModel);
    const projectHandler = new ProjectHandler(projectService);
    const s = initServer();
    const projectsRouter = s.router(ProjectContract, {
      list: projectHandler.list.bind(projectHandler),
      get: projectHandler.get.bind(projectHandler),
      create: projectHandler.create.bind(projectHandler),
      update: projectHandler.update.bind(projectHandler),
      delete: projectHandler.delete.bind(projectHandler),
    });

    createExpressEndpoints(ProjectContract, projectsRouter, app);
  }
    ```

7. **Add Tests**:
    - e2e test using super-test
    - integration test on *.model.ts file


Following these steps will help you add a new route to the project in a structured and consistent manner.