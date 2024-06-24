import * as z from 'zod';

const OrganizationSchema = z.object(
  {
    id: z.string().min(1, { message: 'Organization Id is required' }),
    name: z.string().min(1, { message: 'Organization name is required' }),
    isMpcaActive: z.boolean(),
    isWashActive: z.boolean(),
    isShelterActive: z.boolean(),
    activities: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        serviceType: z.string(),
      }),
    ),
  },
  { invalid_type_error: 'Organization is required', required_error: 'Organization is required' },
);

const FocalPointSchema = z
  .object(
    {
      id: z.string().min(1, { message: 'Focal Point Id is required' }),
      firstName: z.string().min(1, { message: 'Focal Point first name is required' }),
      lastName: z.string().min(1, { message: 'Focal Point last name is required' }),
    },
    { invalid_type_error: 'Focal point is required', required_error: 'Focal point is required' },
  )
  .nullable()
  .optional();

export const SentReferralSchema = z
  .object({
    isUrgent: z.boolean(),
    serviceCategory: z.string().min(1, { message: 'Service category required' }),
    subactivities: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        serviceType: z.string(),
      }),
    ),
    organizationReferredTo: OrganizationSchema,
    displacementStatus: z.string().optional(),
    householdSize: z.string().optional(),
    householdMonthlyIncome: z.string().optional(),
    householdsVulnerabilityCriteria: z.array(z.string()),
    firstName: z.string().min(1, { message: 'First name required' }),
    patronymicName: z.string().min(1, { message: 'Patronymic name required' }),
    surname: z.string().min(1, { message: 'Surname required' }),
    dateOfBirth: z
      .date({ required_error: 'Date of birth required', invalid_type_error: 'Date of birth required' })
      .optional(),
    gender: z.string().min(1, { message: 'Gender required' }),
    taxId: z.string().optional(),
    address: z.string(),
    oblast: z.string(),
    ryon: z.string(),
    hromada: z.string(),
    settlement: z.string(),
    email: z.string().optional(),
    phone: z.string().optional(),
    contactPreference: z.string(),
    restrictions: z.string(),
    consent: z.boolean(),
    required: z.string().min(1, { message: 'Reason is required' }),
    needForService: z.string(),
    isSeparated: z.boolean(),
    isCaregiverInformed: z.string(),
    caregiverExplanation: z.string().optional(),
    caregiver: z.string().optional(),
    relationshipToChild: z.string().optional(),
    caregiverEmail: z.string().optional(),
    caregiverPhone: z.string(),
    caregiverContactPreference: z.string(),
    caregiverNote: z.string(),
    focalPoint: FocalPointSchema,
    status: z.string(),
    isDraft: z.boolean(),
    userCreated: FocalPointSchema,
    files: z.array(z.any()).optional(),
    focalPointId: z.string(),
    isMinor: z.boolean(),
    noTaxId: z.boolean(),
    subactivitiesIds: z.array(z.string()),
  })
  .superRefine((data, ctx) => {
    if (data.isMinor) {
      if (!data.caregiver) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Caregiver name required',
          path: ['caregiver'],
        });
      }

      if (data.caregiverContactPreference && data.caregiverContactPreference === 'email' && !data.caregiverEmail) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Caregiver email required',
          path: ['caregiverEmail'],
        });
      }

      if (data.caregiverContactPreference && data.caregiverContactPreference === 'phone' && !data.caregiverPhone) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Caregiver phone required',
          path: ['caregiverPhone'],
        });
      }

      if (!data.relationshipToChild) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Relationship to child required',
          path: ['relationshipToChild'],
        });
      }
    }

    if (data.isCaregiverInformed === 'false' && data.isMinor) {
      if (!data.caregiverExplanation) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Caregiver explanation required',
          path: ['caregiverExplanation'],
        });
      }
    }

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

    if (!data.noTaxId) {
      if (!data.taxId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Tax ID required',
          path: ['taxId'],
        });
      }
    }

    if (data.contactPreference && data.contactPreference === 'phone') {
      if (!data.phone) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Phone required',
          path: ['phone'],
        });
      }
    }

    if (data.contactPreference && data.contactPreference === 'email') {
      if (!data.email) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Email required',
          path: ['email'],
        });
      }
    }
  });

export type SentReferralFormData = z.infer<typeof SentReferralSchema>;
