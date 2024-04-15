import { useState } from 'react';
import { CheckIcon, Command, SendHorizonal, UserPlus2 } from 'lucide-react';
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useUserMutation } from '@/services/users/api';
import { toast } from '@/components/ui/use-toast';

import { AddUserModalForm, AddUserModalFormSchema } from './validation';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/helpers/utils';
import { CaretSortIcon } from '@radix-ui/react-icons';
import { CommandInput, CommandEmpty, CommandGroup, CommandItem } from 'cmdk';
import { useOrganizations } from '@/services/organizations/api';
import { usePagination } from '@/helpers/pagination';

export const AddUserModal = () => {
  const pagination = usePagination();
  const [open, setOpen] = useState<boolean>(false);
  const form = useForm<AddUserModalForm>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      organizationId: '',
    },
    mode: 'onSubmit',
    resolver: zodResolver(AddUserModalFormSchema),
  });

  const { control, handleSubmit, reset } = form;

  const { data: organizations } = useOrganizations(pagination);

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
      <DialogContent className="sm:max-w-[500px]">
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
                      <FormLabel>First name</FormLabel>
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
                      <FormLabel>Last name</FormLabel>
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input id="username" placeholder="email@example.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="organizationId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Organization</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn('w-[200px] justify-between', !field.value && 'text-muted-foreground')}
                          >
                            {field.value
                              ? organizations?.data?.find((organization) => organization.id === field.value)?.id
                              : 'Select language'}
                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput placeholder="Search framework..." className="h-9" />
                          <CommandEmpty>No framework found.</CommandEmpty>
                          <CommandGroup>
                            {organizations?.data?.map((organization) => (
                              <CommandItem
                                value={organization.name}
                                key={organization.id}
                                onSelect={() => {
                                  form.setValue('organizationId', organization.id);
                                }}
                              >
                                {organization.name}
                                <CheckIcon
                                  className={cn(
                                    'ml-auto h-4 w-4',
                                    organization.id === field.value ? 'opacity-100' : 'opacity-0',
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
                <FormField
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
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
