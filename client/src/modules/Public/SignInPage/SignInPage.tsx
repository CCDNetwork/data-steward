import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { NavLink } from 'react-router-dom';
import { APP_ROUTE } from '@/helpers/constants';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PublicPage } from '@/layouts/PublicPage';
import { toast } from '@/components/ui/use-toast';
import { useAuthMutation } from '@/services/auth';
import { useAuth } from '@/providers/GlobalProvider';

import { SignInFormData, SignInFormSchema } from './validations';

export const SignInPage = () => {
  const { loginUser } = useAuth();
  const form = useForm<SignInFormData>({
    defaultValues: {
      username: '',
      password: '',
    },
    resolver: zodResolver(SignInFormSchema),
  });

  const { control, formState, handleSubmit } = form;

  const { login } = useAuthMutation();

  const onSubmit = handleSubmit(async (values) => {
    try {
      const authData = await login.mutateAsync(values);
      loginUser(authData);
      toast({
        title: 'Successfully logged in!',
        variant: 'default',
        description: `Welcome, ${authData.user.firstName}.`,
      });
    } catch (error: any) {
      toast({
        title: 'An error has occured!',
        variant: 'destructive',
        description:
          error.response?.data?.errorMessage || 'Something went wrong',
      });
    }
  });

  return (
    <PublicPage
      title="Welcome back"
      subtitle="Enter your credentials to sign in to your account"
      boxClassName="sm:max-w-[400px]"
    >
      <Form {...form}>
        <form onSubmit={onSubmit} className="w-full">
          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      id="username"
                      placeholder="email@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      id="password"
                      autoComplete="current-password"
                      placeholder="Password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end pt-2 pb-4">
            <NavLink
              to={APP_ROUTE.RequestNewPassword}
              className="text-sm text-primary font-medium hover:underline focus:outline-primary"
            >
              Forgot your password?
            </NavLink>
          </div>
          <Button
            isLoading={formState.isSubmitting || login.isLoading}
            disabled={formState.isSubmitting || login.isLoading}
            type="submit"
            variant="default"
            className="w-full"
          >
            Sign in
          </Button>
        </form>
      </Form>
    </PublicPage>
  );
};
