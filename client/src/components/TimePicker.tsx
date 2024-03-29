import * as React from 'react';
import { Clock } from 'lucide-react';

import { TimePickerInput } from '@/components/TimePickerInput';
import { ControllerRenderProps } from 'react-hook-form';

interface TimePickerProps {
  field: ControllerRenderProps<any, any>;
}

export function TimePicker({ field }: TimePickerProps) {
  const minuteRef = React.useRef<HTMLInputElement>(null);
  const hourRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center gap-3">
      <div className="flex h-full">
        <Clock className="h-4 w-4 mx-auto" />
      </div>
      <div className="flex text-center items-center gap-2">
        <TimePickerInput
          picker="12hours"
          date={field.value}
          setDate={field.onChange}
          ref={hourRef}
          onRightFocus={() => minuteRef.current?.focus()}
        />
        <p className="mb-1">:</p>
        <TimePickerInput
          picker="minutes"
          date={field.value}
          setDate={field.onChange}
          ref={minuteRef}
          onLeftFocus={() => hourRef.current?.focus()}
        />
      </div>
    </div>
  );
}
