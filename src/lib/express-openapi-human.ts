// WORK on THIS: strictly typed swagger docs.

// import type {
//     RouteConfig as RouteConfigBase,
//     ZodMediaTypeObject,
//     ZodRequestBody,
//   } from '@asteasolutions/zod-to-openapi'
//   import {
//     OpenAPIRegistry,
//     OpenApiGeneratorV3,
//     OpenApiGeneratorV31,
//     extendZodWithOpenApi,
//   } from '@asteasolutions/zod-to-openapi'
//   import express from 'express'
//   import type { Request, Response, NextFunction, Router, IRouterMatcher } from 'express'
//   import { z } from 'zod'
//   import type { ZodError } from 'zod'
  
//   type MaybePromise<T> = Promise<T> | T
  
//   export type RouteConfig = RouteConfigBase & {
//     middleware?: express.RequestHandler | express.RequestHandler[]
//   }
  
//   type RequestTypes = {
//     body?: ZodRequestBody
//     params?: z.ZodType
//     query?: z.ZodType
//     cookies?: z.ZodType
//     headers?: z.ZodType | z.ZodType[]
//   }
  
//   type ValidationResult<T> = {
//     success: true
//     data: T
//   } | {
//     success: false
//     error: ZodError
//   }
  
//   export type Hook = (
//     result: ValidationResult<any>,
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) => void | Promise<void>
  
//   export class OpenAPIExpress {
//     private openAPIRegistry: OpenAPIRegistry
//     private router: Router
//     private defaultHook?: Hook
  
//     constructor(options?: { defaultHook?: Hook }) {
//       this.openAPIRegistry = new OpenAPIRegistry()
//       this.router = express.Router()
//       this.defaultHook = options?.defaultHook
//     }
  
//     private async validateRequest(
//       schema: z.ZodType,
//       data: any,
//       hook?: Hook
//     ): Promise<ValidationResult<any>> {
//       try {
//         const validData = await schema.parseAsync(data)
//         return { success: true, data: validData }
//       } catch (error) {
//         return { success: false, error: error as ZodError }
//       }
//     }
  
//     private createValidator(
//       schema: z.ZodType,
//       dataExtractor: (req: Request) => any,
//       hook?: Hook
//     ): express.RequestHandler {
//       return async (req: Request, res: Response, next: NextFunction) => {
//         const result = await this.validateRequest(schema, dataExtractor(req), hook)
        
//         if (this.defaultHook) {
//           await this.defaultHook(result, req, res, next)
//         }
        
//         if (hook) {
//           await hook(result, req, res, next)
//         }
  
//         if (!result.success) {
//           res.status(400).json({ 
//             error: 'Validation Error',
//             details: result.error.errors 
//           })
//           return
//         }
  
//         // Attach validated data to request object
//         ;(req as any).validatedData = result.data
//         next()
//       }
//     }
  
//     openapi<R extends RouteConfig>(
//       route: R,
//       handler: (req: Request, res: Response, next: NextFunction) => MaybePromise<void>
//     ): this {
//       this.openAPIRegistry.registerPath(route)
  
//       const validators: express.RequestHandler[] = []
  
//       // Add validators for different request parts
//       if (route.request?.query) {
//         validators.push(
//           this.createValidator(
//             route.request.query,
//             (req) => req.query,
//             this.defaultHook
//           )
//         )
//       }
  
//       if (route.request?.params) {
//         validators.push(
//           this.createValidator(
//             route.request.params,
//             (req) => req.params,
//             this.defaultHook
//           )
//         )
//       }
  
//       if (route.request?.headers) {
//         const headerSchema = Array.isArray(route.request.headers)
//           ? z.union(route.request.headers as [z.ZodType, z.ZodType, ...z.ZodType[]])
//           : route.request.headers
//         validators.push(
//           this.createValidator(
//             headerSchema,
//             (req) => req.headers,
//             this.defaultHook
//           )
//         )
//       }
  
//       if (route.request?.body?.content) {
//         for (const [mediaType, content] of Object.entries(route.request.body.content)) {
//           if (!content) continue
          
//           const schema = (content as ZodMediaTypeObject)['schema']
//           if (!(schema instanceof z.ZodType)) continue
  
//           validators.push(
//             this.createValidator(
//               schema,
//               (req) => req.body,
//               this.defaultHook
//             )
//           )
//         }
//       }
  
//       // Add route with validators and handler
//       const middleware = route.middleware
//         ? Array.isArray(route.middleware)
//           ? route.middleware
//           : [route.middleware]
//         : []
  
//       const method = route.method.toLowerCase() as Lowercase<R['method']>
//       const routerMethod = this.router[method] as IRouterMatcher<Router>
//       if (routerMethod) {
//         routerMethod.bind(this.router)(
//           route.path.replaceAll(/\{(.+?)\}/g, ':$1'),
//           ...middleware,
//           ...validators,
//           handler
//         )
//       }
  
//       return this
//     }
  
//     getOpenAPIDocument(config: Parameters<typeof OpenApiGeneratorV3.prototype.generateDocument>[0]) {
//       const generator = new OpenApiGeneratorV3(this.openAPIRegistry.definitions)
//       return generator.generateDocument(config)
//     }
  
//     getOpenAPI31Document(config: Parameters<typeof OpenApiGeneratorV31.prototype.generateDocument>[0]) {
//       const generator = new OpenApiGeneratorV31(this.openAPIRegistry.definitions)
//       return generator.generateDocument(config)
//     }
  
//     doc(
//       path: string,
//       config: Parameters<typeof OpenApiGeneratorV3.prototype.generateDocument>[0]
//     ): this {
//       this.router.get(path, (req, res) => {
//         try {
//           const document = this.getOpenAPIDocument(config)
//           res.json(document)
//         } catch (e: any) {
//           res.status(500).json(e)
//         }
//       })
//       return this
//     }
  
//     doc31(
//       path: string,
//       config: Parameters<typeof OpenApiGeneratorV31.prototype.generateDocument>[0]
//     ): this {
//       this.router.get(path, (req, res) => {
//         try {
//           const document = this.getOpenAPI31Document(config)
//           res.json(document)
//         } catch (e: any) {
//           res.status(500).json(e)
//         }
//       })
//       return this
//     }
  
//     // Get the underlying Express router
//     getRouter(): Router {
//       return this.router
//     }
//   }
  
//   export const createRoute = <R extends Omit<RouteConfig, 'path'> & { path: string }>(
//     routeConfig: R
//   )=> {
//     return {
//       ...routeConfig,
//       getRoutingPath(): string {
//         return routeConfig.path.replaceAll(/\{(.+?)\}/g, ':$1')
//       },
//     }
//   }
  
//   extendZodWithOpenApi(z)
//   export { extendZodWithOpenApi, z }