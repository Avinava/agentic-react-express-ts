import { describe, expect, it, vi } from 'vitest';

import { appRouter } from '../routers/index.js';
import { createCallerFactory } from '../trpc.js';

const createCaller = createCallerFactory(appRouter);

describe('contact router (validation)', () => {
  it('rejects empty firstName', async () => {
    const caller = createCaller({
      prisma: { contact: { create: vi.fn() } } as never,
      req: {} as never,
      res: {} as never,
    });

    await expect(
      caller.contact.create({
        firstName: '',
        lastName: 'Lovelace',
        email: 'ada@example.com',
      }),
    ).rejects.toThrow();
  });
});
