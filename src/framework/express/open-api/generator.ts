import { initContract } from "@ts-rest/core";
import { generateOpenApi } from "@ts-rest/open-api";

import { ideasContract } from "@/routes/ideas-ts-rest/ideas.contract.js";

import { TaskContract } from "../../../routes/tasks/task.contract.js";

export function generateOpenApiDocument() {
  const contract = initContract().router({
    ...TaskContract,
    ...ideasContract,
  });

  return generateOpenApi(contract, {
    info: {
      title: "Tasks API",
      version: "1.0.0",
    },
  });
}
