import { z } from 'zod';

export const projectInput = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional().nullable(),
  status: z.string().min(1).max(40).default('active'),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional().nullable(),
});

export type ProjectInput = z.infer<typeof projectInput>;

export const projectUpdateInput = projectInput.partial().extend({
  id: z.number().int().positive(),
});
