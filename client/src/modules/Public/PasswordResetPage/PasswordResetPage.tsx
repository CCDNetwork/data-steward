import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PublicPage } from '@/layouts/PublicPage';
import { toast } from '@/components/ui/use-toast';
import { APP_ROUTE } from '@/helpers/constants';
import { useAuthMutation } from '@/services/auth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PasswordResetForm, PasswordResetFormSchema } from '@/modules/Public/PasswordResetPage/validations';

export const PasswordResetPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const form = useForm<PasswordResetForm>({
    defaultValues: {
      email: searchParams.get('email') || '',
      passwordResetCode: searchParams.get('code') || '',
      password: '',
      passwordConfirmation: '',
    },
    resolver: zodResolver(PasswordResetFormSchema),
  });

  const { control, formState, handleSubmit } = form;

  const { resetPassword } = useAuthMutation();

  const onSubmit = handleSubmit(async (values) => {
    try {
      await resetPassword.mutateAsync(values);
      navigate(APP_ROUTE.SignIn);
      toast({
        title: 'Password successfully changed!',
        variant: 'default',
        description: 'You can now sign in with your new password.',
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
    <PublicPage
      title="Password reset"
      subtitle={searchParams.has('code') && searchParams.has('email') ? 'Choose a new password for your account' : ''}
      showLink
      linkLabel="&larr;  Back to Sign In"
      linkNavigateTo={APP_ROUTE.SignIn}
    >
      {searchParams.has('code') && searchParams.has('email') ? (
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-8 w-full">
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New password</FormLabel>
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
                    <FormLabel>Confirm new password</FormLabel>
                    <FormControl>
                      <Input id="passwordConfirmation" placeholder="Confirm password" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              isLoading={formState.isSubmitting || resetPassword.isLoading}
              disabled={formState.isSubmitting || resetPassword.isLoading}
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
          <p>Invalid password reset URL</p>
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
