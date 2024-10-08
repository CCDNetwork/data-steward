import * as React from 'react';
import { CalendarIcon } from '@radix-ui/react-icons';
import { ControllerRenderProps } from 'react-hook-form';
import { format } from 'date-fns';

import { cn } from '@/helpers/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export interface DatePickerProps
  extends React.AllHTMLAttributes<HTMLDivElement> {
  fromDate?: Date;
  field: ControllerRenderProps<any, any>;
  btnclass?: string;
  disabled?: boolean;
}

const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  ({ field, btnclass, disabled, ...props }, ref) => {
    return (
      <div ref={ref} {...props}>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              disabled={disabled}
              variant={'outline'}
              className={cn(
                'w-[240px] justify-start text-left font-normal',
                !field.value && 'text-muted-foreground',
                disabled &&
                  '!cursor-not-allowed !disabled:pointer-events-auto pointer-events-auto',
                btnclass
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {field.value ? (
                format(field.value, 'PPP')
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="single"
              captionLayout="dropdown-buttons"
              fromYear={1920}
              toYear={new Date().getFullYear()}
              selected={field.value}
              onSelect={field.onChange}
              fromDate={props.fromDate}
            />
          </PopoverContent>
        </Popover>
      </div>
    );
  }
);

DatePicker.displayName = 'DatePicker';

export { DatePicker };
