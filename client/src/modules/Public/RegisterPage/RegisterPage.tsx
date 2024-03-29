import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PublicPage } from '@/layouts/PublicPage';
import { useToast } from '@/components/ui/use-toast';
import { APP_ROUTE } from '@/helpers/constants';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthMutation } from '@/services/auth';

import { RegisterFormData, RegisterFormSchema } from './validations';
import { defaultRegisterFormValues } from './const';

export const RegisterPage = () => {
  // const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<RegisterFormData>({
    defaultValues: defaultRegisterFormValues,
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: zodResolver(RegisterFormSchema),
  });

  const { control, formState, handleSubmit } = form;

  const { registerAccount } = useAuthMutation();

  const onSubmit = handleSubmit(async (values) => {
    try {
      await registerAccount.mutateAsync(values);
      // navigate(APP_ROUTE.RegistrationSuccess, { replace: true, state: { key: values.email } });
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
      title="Create an account"
      subtitle="Enter your information below to create your account"
      showLink
      linkLabel="Already have an account? Sign In"
      linkNavigateTo={APP_ROUTE.SignIn}
    >
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-8 max-w-[400px]">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Enter your account information here. Click next when you&apos;re done.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First name</FormLabel>
                        <FormControl>
                          <Input id="firstName" placeholder="First name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last name</FormLabel>
                        <FormControl>
                          <Input id="lastName" placeholder="Last name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input id="email" placeholder="email@example.com" type="email" {...field} />
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
                  name="confirmPassword"
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
            </CardContent>
            <CardFooter className="justify-end">
              <Button
                isLoading={formState.isSubmitting || registerAccount.isLoading}
                disabled={formState.isSubmitting || registerAccount.isLoading}
                type="submit"
                variant="default"
                className="w-full"
              >
                Register
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
      <span className="px-8 text-center text-sm text-muted-foreground max-w-[300px]">
        By clicking register, you agree to our{' '}
        <Link to="/terms" className="underline underline-offset-4">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link to="/privacy" className="underline underline-offset-4">
          Privacy Policy
        </Link>
        .
      </span>
    </PublicPage>
  );
};
