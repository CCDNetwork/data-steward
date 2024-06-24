import { useState } from 'react';
import { Building2, SendHorizonal } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';
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
import { useOrganizationMutation } from '@/services/organizations/api';
import { toast } from '@/components/ui/use-toast';

import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { ServiceActivities } from '@/modules/Organizations/components';

import { AddOrganizationModalFormSchema, AddOrganizationModalForm } from './validation';
import { defaultNewOrganizationFormFormValues } from './const';
import { OrgActivity } from '@/services/organizations';

export const AddOrganizationModal = () => {
  const [open, setOpen] = useState<boolean>(false);
  const form = useForm<AddOrganizationModalForm>({
    defaultValues: defaultNewOrganizationFormFormValues,
    mode: 'onSubmit',
    resolver: zodResolver(AddOrganizationModalFormSchema),
  });

  const { control, handleSubmit, reset, watch } = form;

  const [isMPCAChecked, isWashChecked, isShelterChecked] = watch(['isMpcaActive', 'isWashActive', 'isShelterActive']);

  const { fields, append, remove } = useFieldArray({ control, name: 'activities' });

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
      <DialogContent className="sm:max-w-[500px]">
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
                    <FormLabel requiredField>Organization name</FormLabel>
                    <FormControl>
                      <Input id="name" placeholder="Organization name" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Separator />
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <FormField
                    control={control}
                    name="isMpcaActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>MPCA</FormLabel>
                          <FormDescription>Information about what MPCA is here.</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  {isMPCAChecked && (
                    <ServiceActivities
                      activities={fields}
                      addActivity={append}
                      removeActivity={remove}
                      serviceType={OrgActivity.Mpca}
                    />
                  )}
                </div>
                <Separator />
                <div>
                  <FormField
                    control={control}
                    name="isWashActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>WASH</FormLabel>
                          <FormDescription>Information about what WASH is here.</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  {isWashChecked && (
                    <ServiceActivities
                      activities={fields}
                      addActivity={append}
                      removeActivity={remove}
                      serviceType={OrgActivity.Wash}
                    />
                  )}
                </div>
                <Separator />
                <div>
                  <FormField
                    control={control}
                    name="isShelterActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Shelter</FormLabel>
                          <FormDescription>Information about what Shelter is here.</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  {isShelterChecked && (
                    <ServiceActivities
                      activities={fields}
                      addActivity={append}
                      removeActivity={remove}
                      serviceType={OrgActivity.Shelter}
                    />
                  )}
                </div>
              </div>

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
