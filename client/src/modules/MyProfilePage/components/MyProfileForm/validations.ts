import * as z from 'zod';

export const UserProfileFormSchema = z
  .object({
    firstName: z.string().min(1, { message: 'First name is required' }),
    lastName: z.string().min(1, { message: 'Last name is required' }),
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
        { message: 'Password must contain at least 8 characters' },
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
    { message: 'Passwords must match', path: ['confirmPassword'] },
  );

export type UserProfileFormData = z.infer<typeof UserProfileFormSchema>;
