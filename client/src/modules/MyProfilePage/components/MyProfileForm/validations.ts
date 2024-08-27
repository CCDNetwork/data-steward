import * as z from 'zod';

import { requiredSafeHtmlString } from '@/helpers/common';

export const UserProfileFormSchema = z
  .object({
    firstName: requiredSafeHtmlString('First name is required'),
    lastName: requiredSafeHtmlString('Last name is required'),
    email: z.string().email(),
    password: z
      .string()
      .optional()
      .refine(
        (data) => {
          if (data && data.length < 8) {
            return false;
          }
          return true;
        },
        { message: 'Password must contain at least 8 characters' }
      ),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.password && data.password !== data.confirmPassword) {
        return false;
      }
      return true;
    },
    { message: 'Passwords must match', path: ['confirmPassword'] }
  );

export type UserProfileFormData = z.infer<typeof UserProfileFormSchema>;
