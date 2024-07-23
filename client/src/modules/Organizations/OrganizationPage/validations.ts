import * as z from 'zod';

export const OrganizationEditFormSchema = z.object({
  name: z.string().min(1, { message: 'First name is required' }),
  isMpcaActive: z.boolean(),
  isWashActive: z.boolean(),
  isShelterActive: z.boolean(),
  isFoodAssistanceActive: z.boolean(),
  isLivelihoodsActive: z.boolean(),
  isProtectionActive: z.boolean(),
  activities: z.array(
    z.object({
      id: z.string().optional(),
      title: z.string(),
      serviceType: z.string(),
    }),
  ),
});

export type OrganizationEditFormData = z.infer<typeof OrganizationEditFormSchema>;
