import type { Request, Response, NextFunction } from 'express';
import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

// Helper type to extract response type from RouteConfig
type ExtractResponseType<R extends RouteConfig> = 
  R extends { responses: { [key: string]: { content: { 'application/json': { schema: z.ZodType<any> } } } } }
    ? z.infer<R['responses'][keyof R['responses']]['content']['application/json']['schema']>
    : unknown;

// Helper type to extract request body type from RouteConfig
type ExtractRequestBody<R extends RouteConfig> = 
  R extends { request: { body: { content: { 'application/json': { schema: z.ZodType<any> } } } } }
    ? z.infer<R['request']['body']['content']['application/json']['schema']>
    : unknown;

// Helper type to extract query params from RouteConfig
type ExtractQueryParams<R extends RouteConfig> = 
  R extends { request: { query: z.ZodType<any> } }
    ? z.infer<R['request']['query']>
    : unknown;

// Helper type to extract path params from RouteConfig
type ExtractPathParams<R extends RouteConfig> = 
  R extends { request: { params: z.ZodType<any> } }
    ? z.infer<R['request']['params']>
    : Record<string, string>;

// Extended Express Request type with typed body, query, and params
export interface TypedRequest<R extends RouteConfig> extends Request<ExtractPathParams<R>, any, ExtractRequestBody<R>, ExtractQueryParams<R>> {}

// Extended Express Response type with typed body
export interface TypedResponse<R extends RouteConfig> extends Response<ExtractResponseType<R>> {}

// Express Route Handler type with proper typing
export type RouteHandler<R extends RouteConfig> = (
  req: TypedRequest<R>,
  res: TypedResponse<R>,
  next: NextFunction
) => Promise<void> | void;