import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useIdFromParams } from '@/helpers/common';
import { useReferralMutation } from '@/services/referrals/api';

export const CancelReferralModal = () => {
  const { id: referralId } = useIdFromParams();
  const { patchReferral } = useReferralMutation();

  const onConfirm = async () => {
    try {
      await patchReferral.mutateAsync({ referralId, data: { status: 'cancelled' } });
      toast({
        title: 'Success!',
        variant: 'default',
        description: 'Referral successfully cancelled.',
      });
    } catch (error: any) {
      toast({
        title: 'Something went wrong!',
        variant: 'destructive',
        description: error.response?.data?.errorMessage || 'Error cancelling referral.',
      });
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button isLoading={patchReferral.isLoading} disabled={patchReferral.isLoading} variant="destructive">
          Cancel referral
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone. This will cancel a referral.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
