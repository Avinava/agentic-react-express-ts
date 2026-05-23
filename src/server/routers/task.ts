import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { taskInput, taskUpdateInput } from '../../shared/schemas/index.js';
import { publicProcedure, router } from '../trpc.js';

const idInput = z.object({ id: z.number().int().positive() });

export const taskRouter = router({
  list: publicProcedure.query(({ ctx }) =>
    ctx.prisma.task.findMany({
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
      include: { assignee: true, project: true },
    }),
  ),

  byId: publicProcedure.input(idInput).query(async ({ ctx, input }) => {
    const task = await ctx.prisma.task.findUnique({
      where: { id: input.id },
      include: { assignee: true, project: true },
    });
    if (!task) throw new TRPCError({ code: 'NOT_FOUND', message: 'Task not found' });
    return task;
  }),

  create: publicProcedure
    .input(taskInput)
    .mutation(({ ctx, input }) =>
      ctx.prisma.task.create({ data: input, include: { assignee: true, project: true } }),
    ),

  update: publicProcedure.input(taskUpdateInput).mutation(({ ctx, input }) => {
    const { id, ...data } = input;
    return ctx.prisma.task.update({
      where: { id },
      data,
      include: { assignee: true, project: true },
    });
  }),

  delete: publicProcedure.input(idInput).mutation(async ({ ctx, input }) => {
    await ctx.prisma.task.delete({ where: { id: input.id } });
    return { ok: true };
  }),
});
