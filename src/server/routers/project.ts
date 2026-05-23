import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { projectInput, projectUpdateInput } from '../../shared/schemas/index.js';
import { publicProcedure, router } from '../trpc.js';

const idInput = z.object({ id: z.number().int().positive() });

export const projectRouter = router({
  list: publicProcedure.query(({ ctx }) =>
    ctx.prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { tasks: true, members: true } },
        members: { include: { contact: true } },
      },
    }),
  ),

  byId: publicProcedure.input(idInput).query(async ({ ctx, input }) => {
    const project = await ctx.prisma.project.findUnique({
      where: { id: input.id },
      include: {
        tasks: true,
        members: { include: { contact: true } },
      },
    });
    if (!project) throw new TRPCError({ code: 'NOT_FOUND', message: 'Project not found' });
    return project;
  }),

  create: publicProcedure
    .input(projectInput)
    .mutation(({ ctx, input }) => ctx.prisma.project.create({ data: input })),

  update: publicProcedure.input(projectUpdateInput).mutation(({ ctx, input }) => {
    const { id, ...data } = input;
    return ctx.prisma.project.update({ where: { id }, data });
  }),

  delete: publicProcedure.input(idInput).mutation(async ({ ctx, input }) => {
    await ctx.prisma.$transaction([
      ctx.prisma.projectMember.deleteMany({ where: { projectId: input.id } }),
      ctx.prisma.task.updateMany({ where: { projectId: input.id }, data: { projectId: null } }),
      ctx.prisma.project.delete({ where: { id: input.id } }),
    ]);
    return { ok: true };
  }),
});
