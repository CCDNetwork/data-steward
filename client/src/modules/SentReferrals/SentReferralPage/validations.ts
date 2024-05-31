import * as z from 'zod';

const OrganizationSchema = z.object(
  {
    id: z.string().min(1, { message: 'Organization Id is required' }),
    name: z.string().min(1, { message: 'Organization name is required' }),
  },
  { invalid_type_error: 'Organization is required', required_error: 'Organization is required' },
);

export const SentReferralFormSchema = z.object({
  focalPoint: z.string().min(1, { message: 'Focal Point required' }),
  consent: z.boolean(),
  firstName: z.string().min(1, { message: 'First name is required' }),
  familyName: z.string().min(1, { message: 'Family name is required' }),
  methodOfContact: z.string().min(1, { message: 'Method of contact is required' }),
  contactDetails: z.string().min(1, { message: 'Contact details required' }),
  note: z.string().optional(),
  organizationReferredTo: OrganizationSchema,
  isDraft: z.boolean().optional(),
  status: z.string().optional(),
  files: z.array(z.any()).optional(),
});

export type SentReferralFormData = z.infer<typeof SentReferralFormSchema>;
