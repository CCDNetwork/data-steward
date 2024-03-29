import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PublicPage } from '@/layouts/PublicPage';
import { toast } from '@/components/ui/use-toast';
import { APP_ROUTE } from '@/helpers/constants';
import { useAuthMutation } from '@/services/auth';
import { ForgotPasswordFormData, ForgotPasswordFormSchema } from '@/modules/Public/ForgotPasswordPage/validations';

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const form = useForm<ForgotPasswordFormData>({
    defaultValues: {
      email: '',
    },
    resolver: zodResolver(ForgotPasswordFormSchema),
  });

  const { control, formState, handleSubmit } = form;

  const { forgotPassword } = useAuthMutation();

  const onSubmit = handleSubmit(async (values) => {
    try {
      await forgotPassword.mutateAsync(values);
      navigate(APP_ROUTE.SignIn);
      toast({
        title: 'Success!',
        variant: 'default',
        description: 'Check your email for further instructions.',
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
      title="Reset your password"
      subtitle="Enter your user account's verified email address and we will send you a password reset link"
      showLink
      boxClassName="sm:max-w-[400px]"
      linkLabel="&larr;  Back to Sign In"
      linkNavigateTo={APP_ROUTE.SignIn}
    >
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-8 w-full">
          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input id="email" placeholder="email@example.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            isLoading={formState.isSubmitting || forgotPassword.isLoading}
            disabled={formState.isSubmitting || forgotPassword.isLoading}
            type="submit"
            variant="default"
            className="w-full"
          >
            Send password reset email
          </Button>
        </form>
      </Form>
    </PublicPage>
  );
};
