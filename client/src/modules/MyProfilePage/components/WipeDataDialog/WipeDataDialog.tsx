import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { deleteDeduplicationData } from '@/services/deduplication';

export const WipeDataDialog = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onConfirmWipe = async () => {
    setIsLoading(true);
    try {
      await deleteDeduplicationData();
      toast({
        title: 'Success!',
        variant: 'default',
        description: 'Deduplication data successfully wiped!',
      });
      queryClient.invalidateQueries(['tenant_me']);
    } catch (error: any) {
      toast({
        title: 'Something went wrong!',
        variant: 'destructive',
        description: error.response?.data?.errorMessage || 'An error has occured trying to delete deduplication data',
      });
    }
    setOpen(false);
    setIsLoading(false);
  };

  const onOpenChange = () => {
    setOpen((old) => !old);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Wipe deduplication data</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Action Confirmation</AlertDialogTitle>
          <AlertDialogDescription>Are you sure you want to delete ALL deduplication data?</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button type="button" onClick={onConfirmWipe} isLoading={isLoading} disabled={isLoading}>
            Confirm
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
