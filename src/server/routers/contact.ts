import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { contactInput, contactUpdateInput } from '../../shared/schemas/index.js';
import { publicProcedure, router } from '../trpc.js';

const idInput = z.object({ id: z.number().int().positive() });

export const contactRouter = router({
  list: publicProcedure.query(({ ctx }) =>
    ctx.prisma.contact.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { tasks: true, projects: true } } },
    }),
  ),

  byId: publicProcedure.input(idInput).query(async ({ ctx, input }) => {
    const contact = await ctx.prisma.contact.findUnique({
      where: { id: input.id },
      include: { tasks: true, projects: { include: { project: true } } },
    });
    if (!contact) throw new TRPCError({ code: 'NOT_FOUND', message: 'Contact not found' });
    return contact;
  }),

  create: publicProcedure
    .input(contactInput)
    .mutation(({ ctx, input }) => ctx.prisma.contact.create({ data: input })),

  update: publicProcedure.input(contactUpdateInput).mutation(({ ctx, input }) => {
    const { id, ...data } = input;
    return ctx.prisma.contact.update({ where: { id }, data });
  }),

  delete: publicProcedure.input(idInput).mutation(async ({ ctx, input }) => {
    await ctx.prisma.contact.delete({ where: { id: input.id } });
    return { ok: true };
  }),
});
