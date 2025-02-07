import { generateOpenApi } from '@ts-rest/open-api';

import { ideasContract } from '../../../routes/ideas-ts-rest/ideas.contract.js';

// WIP: create a ts-rest helper to aggregate all contracts and generate a single open api document.
// WIP: rethink on how to handle multiple contracts.
export const generateOpenApiDocument = () => {

  return generateOpenApi(ideasContract, {
    info: {
      title: 'Ideas API',
      version: '1.0.0',
    },
  });
}
