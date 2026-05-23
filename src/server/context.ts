import { prisma } from './prisma.js';

import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';

export function createContext({ req, res }: CreateExpressContextOptions) {
  return { prisma, req, res };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
