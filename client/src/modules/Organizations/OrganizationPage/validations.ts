import * as z from 'zod';

export const OrganizationEditFormSchema = z.object({
  name: z.string().min(1, { message: 'First name is required' }),
});

export type OrganizationEditFormData = z.infer<typeof OrganizationEditFormSchema>;
