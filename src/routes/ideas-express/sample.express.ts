// build a express router with @asteasolutions/zod-to-openapi
/**
 * Everythhing will be bundle under OpenAPIExpress App.
 * 
 * sample function 
 * export function createRouter() {
  return new OpenAPIHono<AppBinding>({
    strict: false,
    defaultHook,
  });
}

export default function createApp() {
  const app = createRouter();

  app.use(pinoLogger());

  app.notFound(notFound);
  app.onError(onError);

  return app;
}

 * 
 * 
 * The createRoute function is a helper function that creates an express route with the given parameters.
 * const create = createRoute({
  path: "/tasks",
  method: "post",
  tags,
  request: {
    body: jsonContentRequired(createTaskSchema, "The task to create"),
  },
  responses: {
    [HTTP_STATUS_CODES.OK]: jsonContent(selectTasksSchema, "The created task"),
    [HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(createTaskSchema),
      "validation error",
    ),
  },
});

 */


// const app = express();
// const openAPI = new OpenAPIExpress();

// // Define routes using createRoute
// const route = createRoute({
//   method: 'post',
//   path: '/api/resource',
//   request: {
//     body: {
//       content: {
//         'application/json': {
//           schema: z.object({
//             // your schema here
//           })
//         }
//       }
//     }
//   },
//   responses: {
//     200: {
//       content: {
//         'application/json': {
//           schema: z.object({
//             // response schema here
//           })
//         }
//       }
//     }
//   }
// });

// // Add route with handler
// openAPI.openapi(route, (req, res) => {
//   // Your handler code here
//   res.json({ success: true });
// });

// // Mount the OpenAPI router
// app.use(openAPI.getRouter());

// // Add OpenAPI documentation endpoint
// openAPI.doc('/api-docs', {
//   openapi: '3.0.0',
//   info: {
//     title: 'API Documentation',
//     version: '1.0.0'
//   }
// });