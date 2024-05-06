import { useState } from 'react';
import { BookPlusIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/components/ui/use-toast';
import { HandbookForm, HandbookFormSchema } from '@/modules/HandbookPage/validation';
import { useHandbookMutation } from '@/services/handbooks/api';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { defaultHandbookFormValues } from '@/modules/HandbookPage/const';

export const CreateHandbookModal = () => {
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<HandbookForm>({
    defaultValues: defaultHandbookFormValues,
    resolver: zodResolver(HandbookFormSchema),
  });

  const { control, handleSubmit, reset } = form;

  const { createHandbook } = useHandbookMutation();

  const onSubmit = handleSubmit(async (values) => {
    try {
      await createHandbook.mutateAsync(values);
      toast({
        title: 'Success!',
        variant: 'default',
        description: 'Handbook successfully created.',
      });
      setOpen(false);
    } catch (error: any) {
      toast({
        title: 'Something went wrong!',
        variant: 'destructive',
        description: error.response?.data?.errorMessage || 'An error occured while creating handbook.',
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
          <BookPlusIcon className="mr-2 w-5 h-5" />
          Create
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1024px]">
        <DialogHeader>
          <DialogTitle>Create a new handbook</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2">
              <FormField
                control={control}
                name="title"
                render={({ field }) => (
                  <FormItem className="pb-4">
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input id="title" placeholder="Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <MarkdownEditor
              name="content"
              textareaProps={{ className: 'focus:border-0' }}
              control={control}
              height={500}
              label="Content"
            />

            <DialogFooter className="pt-4">
              <div>
                <Button
                  type="submit"
                  onClick={onSubmit}
                  isLoading={createHandbook.isLoading}
                  disabled={createHandbook.isLoading}
                  className="w-full mt-2"
                >
                  Create
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
