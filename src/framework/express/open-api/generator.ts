import { generateOpenApi } from '@ts-rest/open-api';

import { TaskContract } from '../../../routes/tasks/task.contract.js';
import { ideasContract } from '@/routes/ideas-ts-rest/ideas.contract.js';
import { initContract } from '@ts-rest/core';

export const generateOpenApiDocument = () => {
  
  const contract = initContract().router({
    ...TaskContract,
    ...ideasContract,
  });

  return generateOpenApi(contract, {
    info: {
      title: 'Tasks API',
      version: '1.0.0',
    },
  });
}
