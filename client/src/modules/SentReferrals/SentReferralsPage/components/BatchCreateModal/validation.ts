import * as z from 'zod';

import { safeHtmlString } from '@/helpers/common';

const OrganizationSchema = z.object(
  {
    id: z.string().min(1, { message: 'Organization Id is required' }),
    name: z.string().min(1, { message: 'Organization name is required' }),
    isMpcaActive: z.boolean(),
    isWashActive: z.boolean(),
    isShelterActive: z.boolean(),
    isLivelihoodsActive: z.boolean(),
    isFoodAssistanceActive: z.boolean(),
    isProtectionActive: z.boolean(),
    activities: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        serviceType: z.string(),
      })
    ),
  },
  {
    invalid_type_error: 'Organization is required',
    required_error: 'Organization is required',
  }
);

export const BatchCreateFormSchema = z
  .object({
    file: z.instanceof(File).refine((file) => file, {
      message: 'File is required',
    }),
    organizationReferredTo: OrganizationSchema,
    serviceCategory: z
      .string()
      .min(1, { message: 'Service category required' }),
    subactivities: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        serviceType: z.string(),
      })
    ),
    displacementStatus: safeHtmlString.optional(),
    householdSize: safeHtmlString.optional(),
    householdMonthlyIncome: safeHtmlString.optional(),
    householdsVulnerabilityCriteria: z.array(z.string()),
  })
  .superRefine((data, ctx) => {
    if (data.serviceCategory === 'mpca') {
      if (!data.displacementStatus) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Displacement status required',
          path: ['displacementStatus'],
        });
      }

      if (!data.householdSize) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Household size required',
          path: ['householdSize'],
        });
      }

      if (!data.householdMonthlyIncome) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Household monthly income required',
          path: ['householdMonthlyIncome'],
        });
      }
    }
  });

export type BatchCreateModalForm = z.infer<typeof BatchCreateFormSchema>;
