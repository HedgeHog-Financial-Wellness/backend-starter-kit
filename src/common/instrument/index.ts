import type { Span } from "@opentelemetry/api";

import { SpanStatusCode, trace } from "@opentelemetry/api";

export const tracer = trace.getTracer("backend-starter-server", "1.0.0");

export function startActiveSpan<T>(name: string, fn: () => Promise<T>): Promise<T> {
  return tracer.startActiveSpan(name, async (span: Span) => {
    try {
      return await fn();
    }
    catch (error) {
      span.setStatus({ code: SpanStatusCode.ERROR, message: "Error handling request" });
      throw error;
    }
    finally {
      span.end();
    }
  });
}
