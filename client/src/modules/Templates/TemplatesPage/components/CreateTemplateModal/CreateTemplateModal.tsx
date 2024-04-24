import { useId, useState } from 'react';
import { FilePlus2Icon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/components/ui/use-toast';
import { useTemplateMutation } from '@/services/templates/api';
import { TemplateForm, TemplateFormSchema } from '@/modules/Templates/validation';
import { STANDARDIZED_TEMPLATE_FIELDS, defaultTemplateFormValues } from '@/modules/Templates/const';

export const CreateTemplateModal = () => {
  const uniqueId = useId();
  const [open, setOpen] = useState<boolean>(false);
  const form = useForm<TemplateForm>({
    defaultValues: defaultTemplateFormValues,
    resolver: zodResolver(TemplateFormSchema),
  });

  const { control, handleSubmit, reset } = form;

  const { createTemplate } = useTemplateMutation();

  const onSubmit = handleSubmit(async (values) => {
    try {
      await createTemplate.mutateAsync(values);
      toast({
        title: 'Success!',
        variant: 'default',
        description: 'Template successfully created.',
      });
      setOpen(false);
    } catch (error: any) {
      toast({
        title: 'Something went wrong!',
        variant: 'destructive',
        description: error.response?.data?.errorMessage || 'An error occured while creating template.',
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
          <FilePlus2Icon className="mr-2 w-5 h-5" />
          Create
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create new template</DialogTitle>
          <DialogDescription>Accordingly map your data fields to the standardized format below.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem className="pb-4">
                  <FormLabel>Template Name</FormLabel>
                  <FormControl>
                    <Input id="name" placeholder="Template name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 gap-4">
              <p className="text-center text-lg font-semibold py-2">Mappings</p>
              {Object.entries(STANDARDIZED_TEMPLATE_FIELDS).map(([fieldName, fieldType]) => (
                <div className="flex justify-between items-center gap-4" key={`${fieldName}-${uniqueId}`}>
                  <span className="capitalize text-sm w-44">{`${fieldName} (${fieldType})`}</span>
                  <p className="text-xl font-light">&rarr;</p>
                  <FormField
                    control={control}
                    name={`${fieldName}` as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input id={fieldName} placeholder="Column name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>
            <DialogFooter className="pt-4">
              <div className="w-full">
                <Button
                  type="submit"
                  onClick={onSubmit}
                  isLoading={createTemplate.isLoading}
                  disabled={createTemplate.isLoading}
                  size="icon"
                  className="w-full mt-2"
                >
                  Create template
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
