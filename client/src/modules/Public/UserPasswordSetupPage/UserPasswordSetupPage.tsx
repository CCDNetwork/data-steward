import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PublicPage } from '@/layouts/PublicPage';
import { toast } from '@/components/ui/use-toast';
import { APP_ROUTE } from '@/helpers/constants';
import { useAuthMutation } from '@/services/auth';

import { PasswordSetupForm, PasswordSetupSchema } from './validations';

export const UserPasswordSetupPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const form = useForm<PasswordSetupForm>({
    defaultValues: {
      email: searchParams.get('email') || '',
      passwordResetCode: searchParams.get('code') || '',
      password: '',
      passwordConfirmation: '',
    },
    resolver: zodResolver(PasswordSetupSchema),
  });

  const { control, formState, handleSubmit } = form;

  const { resetPassword } = useAuthMutation();

  const onSubmit = handleSubmit(async (values) => {
    try {
      await resetPassword.mutateAsync(values);
      navigate(APP_ROUTE.SignIn);
      toast({
        title: 'Password successfully set!',
        variant: 'default',
        description: 'You can now start using your account.',
      });
    } catch (error: any) {
      toast({
        title: 'An error has occured!',
        variant: 'destructive',
        description: error.response?.data?.errorMessage || 'Something went wrong',
      });
    }
  });

  return (
    <PublicPage title="Setup your password" subtitle="Set a password for your account">
      {searchParams.has('code') && searchParams.has('email') ? (
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-8 w-full">
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input id="password" placeholder="Password" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="passwordConfirmation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm password</FormLabel>
                    <FormControl>
                      <Input id="confirmPassword" placeholder="Confirm password" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              isLoading={formState.isSubmitting}
              disabled={formState.isSubmitting}
              type="submit"
              variant="default"
              className="w-full"
            >
              Submit
            </Button>
          </form>
        </Form>
      ) : (
        <span className="text-destructive text-center font-semibold text-lg pb-4">
          <p>Invalid password setup URL</p>
          <p>
            Please try again or contact{' '}
            <a href="mailto:support@support.com" target="_blank" rel="noreferrer" className="underline italic">
              support.
            </a>
          </p>
        </span>
      )}
    </PublicPage>
  );
};
