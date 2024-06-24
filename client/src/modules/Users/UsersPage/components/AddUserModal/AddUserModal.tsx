import { useState } from 'react';
import { SendHorizonal, UserPlus2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useUserMutation } from '@/services/users/api';
import { toast } from '@/components/ui/use-toast';
import { AsyncSelect } from '@/components/AsyncSelect';
import { useOrganizationsInfinite } from '@/services/organizations/api';

import { AddUserModalForm, AddUserModalFormSchema } from './validation';
import { Checkbox } from '@/components/ui/checkbox';

export const AddUserModal = () => {
  const [open, setOpen] = useState<boolean>(false);
  const form = useForm<AddUserModalForm>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      organization: undefined,
      permissions: ['deduplication', 'referral'],
    },
    mode: 'onSubmit',
    resolver: zodResolver(AddUserModalFormSchema),
  });

  const { control, handleSubmit, reset, watch, setValue } = form;

  const currentFormPermissions = watch('permissions');

  const { addUser } = useUserMutation();

  const onSubmit = handleSubmit(async (values) => {
    try {
      await addUser.mutateAsync(values);
      toast({
        title: 'Success!',
        variant: 'default',
        description: 'User successfully created.',
      });
      setOpen(false);
    } catch (error: any) {
      toast({
        title: 'Something went wrong!',
        variant: 'destructive',
        description: error.response?.data?.errorMessage || 'Something went wrong',
      });
    }
  });

  const onPermissionClick = (permission: string) => {
    if (currentFormPermissions?.includes(permission)) {
      const filteredFormPermissions = currentFormPermissions?.filter((i) => i !== permission);
      setValue('permissions', filteredFormPermissions);
      return;
    }

    setValue('permissions', [...currentFormPermissions, permission]);
  };

  const onOpenChange = () => {
    setOpen((old) => !old);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <UserPlus2 className="mr-2 w-5 h-5" />
          Add new
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] overflow-visible">
        <DialogHeader>
          <DialogTitle>Add a new user</DialogTitle>
          <DialogDescription>Submit user information below.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <div className="grid grid-cols-1 gap-4">
              <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
                <FormField
                  control={control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel requiredField>First name</FormLabel>
                      <FormControl>
                        <Input id="firstName" placeholder="John" type="text" {...field} />
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
                        <Input id="lastName" placeholder="Doe" type="text" {...field} />
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
                    <FormLabel requiredField>Email</FormLabel>
                    <FormControl>
                      <Input id="username" placeholder="email@example.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col gap-3">
                <div className="text-sm font-medium leading-none">Permissions</div>
                <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <Checkbox
                    className="shadow-none"
                    checked={currentFormPermissions?.includes('deduplication')}
                    onCheckedChange={() => onPermissionClick('deduplication')}
                  />
                  <div className="space-y-1 leading-3">
                    <FormLabel>Deduplication</FormLabel>
                    <FormDescription>User can use deduplication.</FormDescription>
                  </div>
                </div>
                <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <Checkbox
                    className="shadow-none"
                    checked={currentFormPermissions?.includes('referral')}
                    onCheckedChange={() => onPermissionClick('referral')}
                  />
                  <div className="space-y-1 leading-3">
                    <FormLabel>Referrals</FormLabel>
                    <FormDescription>User can use referrals.</FormDescription>
                  </div>
                </div>
              </div>
              <AsyncSelect
                label="Organization"
                name="organization"
                requiredField
                control={control}
                useInfiniteQueryFunction={useOrganizationsInfinite}
                labelKey="name"
                valueKey="id"
              />
              <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
                <FormField
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel requiredField>Password</FormLabel>
                      <FormControl>
                        <Input
                          id="password"
                          autoComplete="new-password"
                          placeholder="Password"
                          type="password"
                          {...field}
                        />
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
                      <FormLabel requiredField>Confirm password</FormLabel>
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
              </div>

              <DialogFooter>
                <div className="w-full">
                  <Button
                    type="submit"
                    onClick={onSubmit}
                    isLoading={addUser.isLoading}
                    disabled={addUser.isLoading}
                    size="icon"
                    className="w-full mt-2"
                  >
                    <SendHorizonal className="w-5 h-5 mr-2" />
                    Submit
                  </Button>
                </div>
              </DialogFooter>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
