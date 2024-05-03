import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { PageContainer } from '@/components/PageContainer';
import { useUser, useUserMutation } from '@/services/users/api';
import { useIdFromParams } from '@/helpers/common';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
// import { AsyncSelect } from '@/components/AsyncSelect';
// import { useOrganizationsInfinite } from '@/services/organizations/api';

import { dataToUserEditFormData } from './form-transformation';
import { defaultUserEditFormFormValues } from './const';
import { UserEditFormData, UserEditFormSchema } from './validations';
import { useLocation } from 'react-router-dom';

export const UserPage = () => {
  const { pathname } = useLocation();
  const { id: userId } = useIdFromParams();

  const { data: userData, isLoading: queryLoading } = useUser({ id: userId, isCreate: false });
  const { patchUser } = useUserMutation();

  const x = pathname.split('/').filter((path) => path);

  console.log(x);

  const form = useForm<UserEditFormData>({
    defaultValues: defaultUserEditFormFormValues,
    resolver: zodResolver(UserEditFormSchema),
  });

  const { control, formState, handleSubmit, reset } = form;

  useEffect(() => {
    if (userData) {
      reset(dataToUserEditFormData(userData));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      await patchUser.mutateAsync({ data: values, userId });
      toast({
        title: 'Success!',
        variant: 'default',
        description: 'User successfully updated.',
      });
    } catch (error: any) {
      toast({
        title: 'Something went wrong!',
        variant: 'destructive',
        description: error.response?.data?.errorMessage || 'Error updating user.',
      });
    }
  });

  return (
    <PageContainer
      pageTitle="User Information"
      pageSubtitle="Personal details"
      containerClassName="sm:p-6 p-0 pt-6"
      headerClassName="sm:px-0 px-6"
      isLoading={queryLoading}
      withBackButton
      headerNode={
        <Button
          type="submit"
          onClick={onSubmit}
          isLoading={patchUser.isLoading}
          disabled={formState.isSubmitting || patchUser.isLoading || !formState.isDirty}
        >
          Save
        </Button>
      }
    >
      <Form {...form}>
        <div className="mt-6 border-t border-border/80">
          <dl className="divide-y divide-border/80">
            <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4 px-6 sm:px-0">
              <dt className="text-sm font-medium leading-6">First Name</dt>
              <dd className="mt-1 text-sm leading-6 text-muted-foreground sm:col-span-2 sm:mt-0">
                <FormField
                  control={control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input id="firstName" className="sm:max-w-sm" placeholder="First name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </dd>
            </div>
            <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4 px-6 sm:px-0">
              <dt className="text-sm font-medium leading-6 ">Last Name</dt>
              <dd className="mt-1 text-sm leading-6 text-muted-foreground sm:col-span-2 sm:mt-0">
                <FormField
                  control={control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input id="lastName" className="sm:max-w-sm" placeholder="Last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </dd>
            </div>
            <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4 px-6 sm:px-0">
              <dt className="text-sm font-medium leading-6 ">Email address</dt>
              <dd className="mt-1 text-sm leading-6 text-muted-foreground sm:col-span-2 sm:mt-0">
                <FormField
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input id="email" className="sm:max-w-sm" disabled placeholder="Email Address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </dd>
            </div>
            {/* <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4 px-6 sm:px-0">
              <dt className="text-sm font-medium leading-6 ">Organization</dt>
              <dd className="mt-1 text-sm leading-6 text-muted-foreground sm:col-span-2 sm:mt-0">
                <AsyncSelect
                  name="organization"
                  control={control}
                  useInfiniteQueryFunction={useOrganizationsInfinite}
                  labelKey="name"
                  valueKey="id"
                  wrapperClassName="sm:max-w-sm"
                />
              </dd>
            </div> */}
            <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4 px-6 sm:px-0">
              <dt className="text-sm font-medium leading-6 ">Password</dt>
              <dd className="mt-1 text-sm leading-6 text-muted-foreground sm:col-span-2 sm:mt-0">
                <FormField
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          id="password"
                          autoComplete="new-password"
                          placeholder="Password"
                          type="password"
                          className="sm:max-w-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </dd>
            </div>
            <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4 px-6 sm:px-0">
              <dt className="text-sm font-medium leading-6 ">Confirm password</dt>
              <dd className="mt-1 text-sm leading-6 text-muted-foreground sm:col-span-2 sm:mt-0">
                <FormField
                  control={control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          id="confirmPassword"
                          autoComplete="new-password"
                          placeholder="Confirm password"
                          className="sm:max-w-sm"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </dd>
            </div>
          </dl>
        </div>
      </Form>
    </PageContainer>
  );
};
