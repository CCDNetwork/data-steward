import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { StatusReasonModalForm, StatusReasonModalFormSchema } from './validation';

export const StatusReasonModal = ({
  open,
  title,
  body,
  confirmButtonLabel = 'Submit',
  cancelButtonLabel = 'Cancel',
  confirmButtonLoading,
  actionButtonVariant = 'default',
  onCancel,
  onAction,
}: Props) => {
  const form = useForm<StatusReasonModalForm>({
    defaultValues: {
      text: '',
    },
    mode: 'onSubmit',
    resolver: zodResolver(StatusReasonModalFormSchema),
  });

  const { control, handleSubmit, reset } = form;

  const onSubmit = handleSubmit(async (values) => {
    onAction(values.text);
    reset();
  });

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="sm:max-w-[500px] overflow-visible">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{body}</AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <div className="space-y-4">
              <FormField
                control={control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel requiredField>Reason</FormLabel>
                    <FormControl>
                      <Textarea id="text" placeholder="Reason" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <AlertDialogFooter>
                <AlertDialogCancel onClick={onCancel}>{cancelButtonLabel}</AlertDialogCancel>
                <Button
                  type="button"
                  variant={actionButtonVariant}
                  onClick={onSubmit}
                  isLoading={confirmButtonLoading}
                  disabled={confirmButtonLoading}
                >
                  {confirmButtonLabel}
                </Button>
              </AlertDialogFooter>
            </div>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

interface Props {
  open: boolean;
  title: string;
  body: React.ReactNode;
  cancelButtonLabel?: string;
  confirmButtonLabel?: string;
  confirmButtonLoading?: boolean;
  actionButtonVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  onCancel: () => void;
  onAction: (text: string) => Promise<void>;
}
