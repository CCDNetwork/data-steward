import { useState } from 'react';
import { Building2, SendHorizonal } from 'lucide-react';
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
import { useOrganizationMutation } from '@/services/organizations/api';
import { toast } from '@/components/ui/use-toast';

import { AddOrganizationModalFormSchema, AddOrganizationModalForm } from './validation';

export const AddOrganizationModal = () => {
  const [open, setOpen] = useState<boolean>(false);
  const form = useForm<AddOrganizationModalForm>({
    defaultValues: {
      name: '',
    },
    mode: 'onSubmit',
    resolver: zodResolver(AddOrganizationModalFormSchema),
  });

  const { control, handleSubmit, reset } = form;

  const { addOrganization } = useOrganizationMutation();

  const onSubmit = handleSubmit(async (values) => {
    try {
      await addOrganization.mutateAsync(values);
      toast({
        title: 'Success!',
        variant: 'default',
        description: 'Organization successfully created.',
      });
      setOpen(false);
    } catch (error: any) {
      toast({
        title: 'Something went wrong!',
        variant: 'destructive',
        description: error.response?.data?.errorMessage || 'Error creating organization.',
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
          <Building2 className="mr-2 w-5 h-5" />
          Add new
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Add a new organization</DialogTitle>
          <DialogDescription>Submit organization information below.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization name</FormLabel>
                    <FormControl>
                      <Input id="name" placeholder="Organization name" type="text" {...field} />
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
                    isLoading={addOrganization.isLoading}
                    disabled={addOrganization.isLoading}
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
