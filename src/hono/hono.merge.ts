import { Hono } from 'hono';
import type { BlankEnv } from 'hono/types';

export type MergeHonoSchemas<R extends readonly Hono<any, any, any>[]> = {
  [K in R[number] as K extends Hono<any, infer Schema, any> ? keyof Schema : never]: K extends Hono<any, infer Schema, any>
    ? Schema[keyof Schema]
    : never;
};

export function mergeHonoRouters<const R extends readonly Hono<any, any, any>[]>(
  options: { before?: ((app: Hono) => void)[] } | undefined,
  ...routers: R
): Hono<BlankEnv, MergeHonoSchemas<R>, '/'> {
  // Merges independent routers into a single router, with, most importantly, the ability to merge schemas,
  // that is absolutely necessary for building contracts for external usage on hono-client

  const app = new Hono();
  if (options?.before) for (const hook of options.before) hook(app); // Basically, applying middleware in most cases
  for (const router of routers) app.route('', router); // Injecting routers into the app
  return app as Hono<BlankEnv, MergeHonoSchemas<R>, '/'>;
}
