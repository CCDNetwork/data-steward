import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useUserMutation } from '@/services/users/api';
import { useAuth } from '@/providers/GlobalProvider';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

import { dataToUserProfileFormData } from './form-transformation';
import { UserProfileFormData, UserProfileFormSchema } from './validations';
import { defaultProfileFormFormValues } from './const';
import { CardFooter } from '@/components/ui/card';
import { User } from '@/services/users';

interface MyProfileFormProps {
  userProfileData: User | undefined;
  userProfileQueryLoading: boolean;
}

export const MyProfileForm = ({ userProfileData, userProfileQueryLoading }: MyProfileFormProps) => {
  const { updateUser } = useAuth();

  const form = useForm<UserProfileFormData>({
    defaultValues: defaultProfileFormFormValues,
    resolver: zodResolver(UserProfileFormSchema),
  });

  const { control, formState, handleSubmit, reset } = form;

  const { editUserMe } = useUserMutation();

  useEffect(() => {
    if (userProfileData) {
      reset(dataToUserProfileFormData(userProfileData));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfileData]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      const res = await editUserMe.mutateAsync(values);
      updateUser(res);
      toast({
        title: 'Success!',
        variant: 'default',
        description: 'Profile successfully updated.',
      });
    } catch (error: any) {
      toast({
        title: 'Something went wrong!',
        variant: 'destructive',
        description: error.response?.data?.errorMessage || 'Something went wrong',
      });
    }
  });

  return (
    <Form {...form}>
      <div className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel requiredField>First name</FormLabel>
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
                <FormLabel requiredField>Last name</FormLabel>
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input id="password" autoComplete="new-password" placeholder="Password" type="password" {...field} />
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
                <Input
                  id="confirmPassword"
                  autoComplete="new-password"
                  placeholder="Confirm password"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <CardFooter className="flex justify-end p-0">
          <Button
            type="button"
            onClick={onSubmit}
            isLoading={userProfileQueryLoading || formState.isSubmitting}
            disabled={userProfileQueryLoading || formState.isSubmitting}
          >
            Save profile
          </Button>
        </CardFooter>
      </div>
    </Form>
  );
};
