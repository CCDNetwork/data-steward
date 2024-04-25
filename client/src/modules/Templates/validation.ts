import * as z from 'zod';

export const TemplateFormSchema = z.object({
  name: z.string().min(1, { message: 'Template name is required' }),
  firstName: z.string(),
  familyName: z.string(),
  gender: z.string(),
  dateofBirth: z.string(),
  hhid: z.string(),
  mobilePhoneID: z.string(),
  govIDType: z.string(),
  govIDNumber: z.string(),
  otherIDType: z.string(),
  otherIDNumber: z.string(),
  assistanceDetails: z.string(),
  activity: z.string(),
  currency: z.string(),
  currencyAmount: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  frequency: z.string(),
  adminLevel1: z.string(),
  adminLevel2: z.string(),
  adminLevel3: z.string(),
  adminLevel4: z.string(),
});

export type TemplateForm = z.infer<typeof TemplateFormSchema>;
