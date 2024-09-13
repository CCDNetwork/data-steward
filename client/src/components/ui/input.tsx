import * as React from 'react';

import { cn } from '@/helpers/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, maxLength = 50, ...props }, ref) => {
    return (
      <input
        type={type}
        maxLength={maxLength}
        className={cn(
          'flex h-9 w-full rounded-md focus:border-primary focus:ring-primary border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 search-cancel:cursor-pointer',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
