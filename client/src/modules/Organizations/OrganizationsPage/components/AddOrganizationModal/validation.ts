import * as z from 'zod';

export const AddOrganizationModalFormSchema = z.object({
  name: z.string().min(1, { message: 'Organization name is required' }),
  isMpcaActive: z.boolean(),
  isWashActive: z.boolean(),
  isShelterActive: z.boolean(),
  activities: z
    .array(
      z.object({
        id: z.string().optional(),
        title: z.string(),
        serviceType: z.string(),
      }),
    )
    .default([]),
});

export type AddOrganizationModalForm = z.infer<typeof AddOrganizationModalFormSchema>;
