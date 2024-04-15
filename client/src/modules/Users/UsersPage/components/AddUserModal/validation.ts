import * as z from 'zod';

export const AddUserModalFormSchema = z
  .object({
    firstName: z.string().min(1, { message: 'First name is required' }),
    lastName: z.string().min(1, { message: 'Last name is required' }),
    email: z.string().email(),
    password: z.string().refine(
      (data) => {
        if ((data && data.length < 8) || !data) {
          return false;
        }
        return true;
      },
      { message: 'Password must contain at least 8 characters' },
    ),
    confirmPassword: z.string().optional(),
    organizationId: z.string().min(1, { message: 'Organization is required' }),
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

export type AddUserModalForm = z.infer<typeof AddUserModalFormSchema>;
