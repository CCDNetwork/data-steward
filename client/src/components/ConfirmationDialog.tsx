import { Button } from '@/components/ui/button';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Props {
  open: boolean;
  title: string;
  body: React.ReactNode;
  cancelButtonLabel?: string;
  confirmButtonLabel?: string;
  confirmButtonLoading?: boolean;
  actionButtonVariant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  onCancel: () => void;
  onAction: () => Promise<void>;
}

export const ConfirmationDialog = ({
  open,
  title,
  body,
  confirmButtonLabel = 'Confirm',
  cancelButtonLabel = 'Cancel',
  confirmButtonLoading,
  actionButtonVariant = 'default',
  onCancel,
  onAction,
}: Props) => {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{body}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>
            {cancelButtonLabel}
          </AlertDialogCancel>
          <Button
            type="button"
            variant={actionButtonVariant}
            onClick={onAction}
            isLoading={confirmButtonLoading}
            disabled={confirmButtonLoading}
          >
            {confirmButtonLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
