# Adding a New Route

### Step-by-Step Guidelines for Adding a New Route to the Project

1. **Create the Folder Structure**:
    - Create a new folder under `src/routes/` for the new route. For example, if the new route is for "projects", create `src/routes/projects/`.

2. **Define the API Contract**:
    - Create a file named `project.contract.ts` in the new folder.
    - Define the API endpoints using `@ts-rest/core`.

    ```typescript
    import { initContract } from '@ts-rest/core';
    import { listProjectSchemaResBody, getProjectSchemaResBody, createProjectSchemaReqBody, patchProjectSchemaReqBody, getProjectRequestPathParamSchema } from "./project.schema.js";
    import { errorResponseSchema } from "@/common/zod-openapi-schema.js";

    export const projectsContract = initContract().router({
      list: {
        method: "GET",
        path: "/",
        responses: {
          200: listProjectSchemaResBody,
        },
        summary: 'Get a list of projects',
      },
      get: {
        method: "GET",
        path: "/:id",
        pathParams: getProjectRequestPathParamSchema,
        responses: {
          200: getProjectSchemaResBody,
          404: errorResponseSchema,
        },
        summary: 'Get a project',
      },
      create: {
        method: "POST",
        path: "/",
        body: createProjectSchemaReqBody,
        responses: {
          200: getProjectSchemaResBody,
          422: errorResponseSchema,
        },
        summary: 'Create a project',
      },
      update: {
        method: "PATCH",
        path: "/:id",
        pathParams: getProjectRequestPathParamSchema,
        body: patchProjectSchemaReqBody,
        responses: {
          200: getProjectSchemaResBody,
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

3. **Define the Data Validation Schemas**:
    - Create a file named `project.schema.ts` in the new folder.
    - Define the data validation schemas using `zod`.

    ```typescript
    import { z } from "zod";
    import { createInsertSchema, createSelectSchema } from "drizzle-zod";
    import { projectsTable } from "../../db/schema/projects.js";
    import { extendZodWithOpenApi } from '@anatine/zod-openapi';

    extendZodWithOpenApi(z);

    export const getProjectSchemaResBody = createSelectSchema(projectsTable).omit({
      id: true,
    }).openapi({
      title: "Project",
      description: "A project Schema",
    });

    export const getProjectRequestPathParamSchema = z.object({
      id: z.string().uuid(),
    });

    export const listProjectSchemaResBody = z.array(getProjectSchemaResBody).openapi({
      title: "Project List",
      description: "A list of projects",
    });

    export const createProjectSchemaReqBody = createInsertSchema(projectsTable, {
      name: schema => schema.min(1).max(500),
    })
      .required({
        done: true,
      })
      .omit({
        id: true,
        createdAt: true,
        updatedAt: true,
      });

    export const patchProjectSchemaReqBody = createProjectSchemaReqBody.partial();
    ```

4. **Create the Repository Interface**:
    - Create a file named `project.repository.ts` in the new folder.
    - Define the interface for data access methods.

    ```typescript
    import { projectsTable } from "@/db/schema/projects.js"

    export interface ProjectRepository {
      list(): Promise<Array<typeof projectsTable.$inferSelect>> 
      get(id: number): Promise<typeof projectsTable.$inferSelect | null> 
      create(project: typeof projectsTable.$inferInsert): Promise<typeof projectsTable.$inferSelect> 
      update(id: number, project: Partial<typeof projectsTable.$inferSelect>): Promise<typeof projectsTable.$inferSelect> 
      delete(id: number): Promise<void> 
    }
    ```

5. **Implement the Data Model**:
    - Create a file named `project.model.ts` in the new folder.
    - Implement the data model that interacts with the database.

    ```typescript
    import { eq } from "drizzle-orm";
    import { drizzle } from "drizzle-orm/node-postgres";
    import { projectsTable } from "@/db/schema/projects.js";
    import type { ProjectRepository } from "./project.repository.js";

    const errProjectCreationFailed = new Error("Unable to create project");
    const errProjectUpdateFailed = new Error("Unable to update project");
    const errProjectDeleteFailed = new Error("Unable to delete project");

    export class ProjectModel implements ProjectRepository {
      constructor(private db: ReturnType<typeof drizzle>) { }

      async list(): Promise<Array<typeof projectsTable.$inferSelect>> {
        const projects = await this.db.select().from(projectsTable);
        if (!projects) {
          return [];
        }
        return projects;
      }

      async get(id: number): Promise<typeof projectsTable.$inferSelect | null> {
        const [project] = await this.db.select().from(projectsTable).where(eq(projectsTable.id, id));
        if (!project) {
          return null;
        }
        return project;
      }

      async create(project: typeof projectsTable.$inferInsert): Promise<typeof projectsTable.$inferSelect> {
        const result = await this.db.insert(projectsTable).values(project).returning();
        if (result.length === 0) {
          throw errProjectCreationFailed;
        }
        return result[0];
      }

      async update(id: number, project: Partial<typeof projectsTable.$inferSelect>): Promise<typeof projectsTable.$inferSelect> {
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

6. **Implement the Service Layer**:
    - Create a file named `project.service.ts` in the new folder.
    - Implement the business logic that interacts with the repository.

    ```typescript
    import { z } from "zod";
    import { projectsTable } from "@/db/schema/projects.js";
    import type { ProjectRepository } from "./project.repository.js";
    import type { getProjectSchemaResBody, listProjectSchemaResBody } from "./project.schema.js";
    import type { UpdateProjectDto } from "./project.dto.js";

    const errProjectNotFound = new Error("Project not found");

    export class ProjectService {
      constructor(private projectRepository: ProjectRepository) { }

      async list(): Promise<z.infer<typeof listProjectSchemaResBody>> {
        const projects = await this.projectRepository.list();

        return projects.map(({ id, ...rest }) => ({
          ...rest
        }));
      };

      async create(name: string, done: boolean): Promise<z.infer<typeof getProjectSchemaResBody>> {
        const project: typeof projectsTable.$inferInsert = {
          name,
          done,
        };
        const newProject = await this.projectRepository.create(project);
        const { id, ...rest } = newProject;
        return rest;
      };

      async get(projectId: number): Promise<z.infer<typeof getProjectSchemaResBody>> {
        const project = await this.projectRepository.get(projectId);

        if (!project) {
          throw errProjectNotFound;
        }
        const { id, ...rest } = project;
        return rest;
      };

      async update(projectId: number, updates: UpdateProjectDto): Promise<z.infer<typeof getProjectSchemaResBody>> {
        const project: Partial<typeof projectsTable.$inferSelect> = {
          ...updates,
        };
        const updatedProject = await this.projectRepository.update(projectId, project);
        const { id, ...rest } = updatedProject;
        return rest;
      };

      async delete(projectId: number): Promise<void> {
        await this.projectRepository.delete(projectId);
      };
    }
    ```

7. **Implement the Handler**:
    - Create a file named `project.handler.ts` in the new folder.
    - Implement the handler that processes HTTP requests and responses.

    ```typescript
    import * as HTTP_STATUS_PHRASES from "@/framework/hono/http-status-phrases.js";
    import { type ServerInferResponses, type ServerInferRequest } from "@ts-rest/core";
    import { projectsContract } from "./project.contract.js";
    import type { ProjectService } from "./project.service.js";

    type ResponseShapes = ServerInferResponses<typeof projectsContract>
    type RequestShapes = ServerInferRequest<typeof projectsContract>

    export class ProjectHandler {
      constructor(private projectService: ProjectService) { }

      async list(): Promise<ResponseShapes['list']> {
        const projects = await this.projectService.list();
        return {
          status: 200 as const,
          body: projects,
        };
      };

      async create(request: RequestShapes['create']): Promise<ResponseShapes['create']> {
        const project = request.body;
        const newProject = await this.projectService.create(project.name, project.done);
        return {
          status: 200 as const,
          body: newProject,
        };
      };

      async get(request: RequestShapes['get']): Promise<ResponseShapes['get']> {
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

      async update(request: RequestShapes['update']): Promise<ResponseShapes['update']> {
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

      async delete(request: RequestShapes['delete']): Promise<ResponseShapes['delete']> {
        await this.projectService.delete(Number(request.params.id));
        return {
          status: 204 as const,
          body: null,
        };
      };
    }
    ```

8. **Configure the Routes**:
    - Create a file named `projects.index.ts` in the new folder.
    - Configure and initialize the routes.

    ```typescript
    import { createRouter } from "@/lib/create-app.js";
    import * as handler from "./project.handler.js";
    import * as routes from "./project.routes.js";

    const router = createRouter()
      .openapi(routes.list, handler.list)
      .openapi(routes.create, handler.create)
      .openapi(routes.getOne, handler.getOne)
      .openapi(routes.patch, handler.patch)
      .openapi(routes.deleteOne, handler.deleteOne);

    export default router;
    ```

9. **Add Unit Tests**:
    - Create a file named `project.test.ts` in the new folder.
    - Add unit tests for the new routes.

    ```typescript
    import { describe, expect, it } from "vitest";
    import { createTestApp } from "@/lib/create-app.js";
    import router from "./projects.index.js";

    describe("projects List", () => {
      it("should return a list of projects", async () => {
        const testApp = createTestApp(router);
        const response = await testApp.request("/projects");
        const result = await response.json ();
        expect(response.status).toBe(200);
        expect(result).toBeInstanceOf(Array);
      });

      it("should return a list of projects: again:> using test client", async () => {
        const testApp = createTestApp(router);
        const response = await testApp.request("/projects");
        const result = await response.json();
        expect(response.status).toBe(200);
        expect(result).toBeInstanceOf(Array);
      });
    });
    ```

10. **Integrate the New Route**:
    - Update the main application file (e.g., `src/index.ts`) to include the new route.

    ```typescript
    import express from "express";
    import { configureProjectsEndpoints } from "./routes/projects/index.js";

    const app = express();
    const db = drizzle(/* database configuration */);

    configureProjectsEndpoints(db, app);

    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
    ```

Following these steps will help you add a new route to the project in a structured and consistent manner.