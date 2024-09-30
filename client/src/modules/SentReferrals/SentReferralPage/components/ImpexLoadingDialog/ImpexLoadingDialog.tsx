import { AlertDialog, AlertDialogContent } from '@/components/ui/alert-dialog';
import { Loader } from 'lucide-react';

export const ImpexLoadingDialog = ({ open }: { open: boolean }) => {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="w-fit">
        <div className="flex flex-col gap-2 items-center justify-center px-8">
          <Loader className="size-8 animate-spin" />
          <p className="pl-2">Please wait...</p>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
