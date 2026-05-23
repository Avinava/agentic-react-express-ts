import { z } from 'zod';

export const taskStatus = z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE']);
export const taskPriority = z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']);

export type TaskStatusType = z.infer<typeof taskStatus>;
export type TaskPriorityType = z.infer<typeof taskPriority>;

export const taskInput = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional().nullable(),
  status: taskStatus.default('TODO'),
  priority: taskPriority.default('MEDIUM'),
  dueDate: z.coerce.date().optional().nullable(),
  assigneeId: z.number().int().positive().optional().nullable(),
  projectId: z.number().int().positive().optional().nullable(),
});

export type TaskInput = z.infer<typeof taskInput>;

export const taskUpdateInput = taskInput.partial().extend({
  id: z.number().int().positive(),
});
