import { type ServerInferResponses, type ServerInferRequest } from "@ts-rest/core";

import { IdeaService } from "./idea.service.js";
import { ideasContract } from "./ideas.contract.js";

type ResponseShapes = ServerInferResponses<typeof ideasContract>
type RequestShapes = ServerInferRequest<typeof ideasContract>

export class IdeaHandler {
  constructor(private ideaService: IdeaService) {}

  async listIdeas(): Promise<ResponseShapes['list']> {
    const ideas = await this.ideaService.listIdeas();

    return {
      status: 200 as const,
      body: ideas,
    };
  }

  async getIdea(request: RequestShapes['get']): Promise<ResponseShapes['get']> {
    const slug = request.params.slug;
    const idea = await this.ideaService.getIdea(slug);
    if (!idea) {
      return {
        status: 404 as const,
        body: {
          message: "Idea not found",
        },
      };
    }
    return {
      status: 200 as const,
      body: idea,
    };
  }
}
