import * as React from 'react';

import { cn } from '@/helpers/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  limitCounterEnabled?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, maxLength, limitCounterEnabled, ...props }, ref) => {
    const [characterCount, setCharacterCount] = React.useState<number>(0);

    React.useEffect(() => {
      if (limitCounterEnabled) {
        setCharacterCount(props?.value?.toString().length ?? 0);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.value]);

    return (
      <>
        <textarea
          className={cn(
            'flex min-h-[80px] w-full rounded-md focus:border-primary focus:ring-primary border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
          maxLength={maxLength}
          ref={ref}
          {...props}
        />
        {limitCounterEnabled && (
          <p
            className={cn('text-right -mt-2 text-xs text-muted-foreground', {
              'font-semibold text-destructive': characterCount === maxLength,
            })}
          >{`${characterCount} / ${maxLength}`}</p>
        )}
      </>
    );
  },
);
Textarea.displayName = 'Textarea';

export { Textarea };
