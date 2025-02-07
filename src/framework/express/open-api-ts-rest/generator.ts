import { ideasContract } from '../../../routes/ideas-ts-rest/ideas.contract.js';
import { generateOpenApi } from '@ts-rest/open-api';


// WIP: rethink on how to handle multiple contracts.
export const configureOpenApi = () => {

  return generateOpenApi(ideasContract, {
    info: {
      title: 'Ideas API',
      version: '1.0.0',
    },
  });
}
