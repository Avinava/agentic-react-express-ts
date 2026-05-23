import { z } from 'zod';

export const contactInput = z.object({
  firstName: z.string().min(1).max(80),
  lastName: z.string().min(1).max(80),
  email: z.string().email(),
  phone: z.string().max(40).optional().nullable(),
  company: z.string().max(120).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
});

export type ContactInput = z.infer<typeof contactInput>;

export const contactUpdateInput = contactInput.partial().extend({
  id: z.number().int().positive(),
});
