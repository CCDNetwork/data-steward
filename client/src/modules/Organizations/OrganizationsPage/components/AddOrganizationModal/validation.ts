import * as z from 'zod';

export const AddOrganizationModalFormSchema = z.object({
  name: z.string().min(1, { message: 'Organization name is required' }),
});

export type AddOrganizationModalForm = z.infer<typeof AddOrganizationModalFormSchema>;
