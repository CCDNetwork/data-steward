import { useRef, useState } from 'react';
import { Loader2, LucideSendHorizontal } from 'lucide-react';

import { useReferralDiscussion, useReferralDiscussionMutation } from '@/services/referrals';
import { cn } from '@/helpers/utils';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { BottomScrolledContainer } from './BottomScrolledContainer';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { formatDate } from 'date-fns';
import { toast } from './ui/use-toast';

interface Props {
  referralId: string;
}

export const ReferralDiscussions = ({ referralId }: Props) => {
  const [isMessageSent, setIsMessageSent] = useState<boolean>(false);
  const [discussionInputValue, setDiscussionInputValue] = useState<string>('');
  const discussionMessageInputRef = useRef<HTMLInputElement | null>(null);

  const {
    data: referralDiscussions,
    isLoading: referralDiscussionLoading,
    refetch: fetchReferralDiscussions,
  } = useReferralDiscussion({
    referralId,
  });

  const { createReferralDiscussionEntry } = useReferralDiscussionMutation();

  const onSendClick = async () => {
    if (!discussionInputValue) {
      discussionMessageInputRef.current?.focus();
      return;
    }

    setIsMessageSent(true);
    try {
      await createReferralDiscussionEntry.mutateAsync({ referralId, text: discussionInputValue });
      fetchReferralDiscussions();
    } catch (error: any) {
      toast({
        title: 'Something went wrong!',
        variant: 'destructive',
        description: error.response?.data?.errorMessage || 'Error sending a message.',
      });
    }
    setIsMessageSent(false);
    setDiscussionInputValue('');
  };

  return (
    <div className="max-w-2xl">
      <Card className="sm:bg-secondary/10 border-0 sm:border sm:dark:bg-secondary/10 shadow-none">
        <CardHeader>
          <CardTitle>Discussion</CardTitle>
          <CardDescription>Referral discussion history</CardDescription>
        </CardHeader>
        <CardContent>
          <BottomScrolledContainer
            containerClassName="max-h-[500px] flex flex-col-reverse gap-4 no-scrollbar"
            shouldTrigger={isMessageSent}
          >
            {referralDiscussionLoading ? (
              <div className="flex items-center justify-center h-[500px]">
                <Loader2 className="w-10 h-10 animate-spin" />
              </div>
            ) : referralDiscussions && referralDiscussions.length > 0 ? (
              referralDiscussions
                ?.sort((a, b) => (a.createdAt! > b.createdAt! ? -1 : 0))
                .map((discussionEntry) => {
                  const { userCreated, text, createdAt, isBot } = discussionEntry;
                  return (
                    <div
                      key={discussionEntry.id}
                      className={cn('px-3 py-2 rounded-md bg-muted flex flex-col', {
                        'bg-primary text-white': !isBot,
                      })}
                    >
                      <div className="flex justify-between text-xs font-medium">
                        <div>
                          {isBot
                            ? 'Activity'
                            : `${userCreated?.firstName} ${userCreated?.lastName} - ${userCreated?.organizations[0].name ?? ''}`}
                        </div>
                        {createdAt && <div className="font-normal">{formatDate(createdAt, 'dd/MM/yyyy HH:mm')}</div>}
                      </div>
                      <p className={cn('text-sm mt-1', { 'italic text-muted-foreground': isBot })}>{text}</p>
                    </div>
                  );
                })
            ) : (
              <div className="text-center text-muted-foreground text-sm">Nothing here yet</div>
            )}
          </BottomScrolledContainer>
        </CardContent>
        <div className="flex gap-2 sm:px-6 pb-6 pt-2">
          <Input
            value={discussionInputValue}
            onChange={(e) => setDiscussionInputValue(e.target.value)}
            placeholder="Send message..."
            ref={discussionMessageInputRef}
          />
          <Button
            type="button"
            variant="ghost"
            className="text-primary hover:text-primary"
            size="icon"
            disabled={createReferralDiscussionEntry.isLoading}
            isLoading={createReferralDiscussionEntry.isLoading}
            loadingIconOnly
            onClick={onSendClick}
          >
            <LucideSendHorizontal className="w-5 h-5" />
          </Button>
        </div>
      </Card>
    </div>
  );
};
