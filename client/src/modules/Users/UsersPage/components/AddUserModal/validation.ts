import * as z from 'zod';

const OrganizationSchema = z.object(
  {
    id: z.string().min(1, { message: 'Organization Id is required' }),
    name: z.string().min(1, { message: 'Organization name is required' }),
  },
  { invalid_type_error: 'Organization is required', required_error: 'Organization is required' },
);

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
    organization: OrganizationSchema,
    role: z.string(),
    permissions: z.array(z.string()).default([]),
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
