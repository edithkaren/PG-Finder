import { z } from 'zod';
import { insertPgSchema, pgs } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  pgs: {
    list: {
      method: 'GET' as const,
      path: '/api/pgs',
      input: z.object({
        city: z.string().optional(),
        gender: z.enum(['male', 'female', 'unisex']).optional(),
        priceMin: z.coerce.number().optional(),
        priceMax: z.coerce.number().optional(),
        search: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof pgs.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/pgs/:id',
      responses: {
        200: z.custom<typeof pgs.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/pgs',
      input: insertPgSchema,
      responses: {
        201: z.custom<typeof pgs.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/pgs/:id',
      input: insertPgSchema.partial(),
      responses: {
        200: z.custom<typeof pgs.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type PgInput = z.infer<typeof api.pgs.create.input>;
export type PgResponse = z.infer<typeof api.pgs.create.responses[201]>;
