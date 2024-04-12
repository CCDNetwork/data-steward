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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useUserMutation } from '@/services/users/api';
import { toast } from '@/components/ui/use-toast';

import { AddUserModalForm, AddUserModalFormSchema } from './validation';

export const AddUserModal = () => {
  const [open, setOpen] = useState<boolean>(false);
  const form = useForm<AddUserModalForm>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
    },
    mode: 'onSubmit',
    resolver: zodResolver(AddUserModalFormSchema),
  });

  const { control, handleSubmit, reset } = form;

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
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Add a new user</DialogTitle>
          <DialogDescription>Submit user information below.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <div className="grid grid-cols-1 gap-4">
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
