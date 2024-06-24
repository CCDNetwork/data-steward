import { Control, useController } from 'react-hook-form';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { FormControl } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/helpers/utils';

type Props = {
  name: string;
  control: Control<any, any>;
  label: string;
  labelClassName?: string;
  requiredField?: boolean;
  options: { value: string; label: string }[];
};

const Combobox = ({ name, control, label, labelClassName, requiredField, options }: Props) => {
  const { field } = useController({ name, control });

  return (
    <div className="flex flex-col justify-end">
      <label
        htmlFor={name}
        className={cn(
          'block text-sm mb-2 font-medium',
          { 'after:content-["_*"] after:text-red-500': requiredField },
          labelClassName,
        )}
      >
        {label}
      </label>
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              role="combobox"
              className={cn('justify-between', !field.value && 'text-muted-foreground')}
            >
              {field.value ? options.find((option) => option.value === field.value)?.label : 'Select...'}
              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="p-0 popover-content-width-full" align="end">
          <Command>
            <CommandInput
              placeholder="Search..."
              className="focus:border-none px-0 border-none outline-none focus:outline-none ring-0 focus:ring-0 h-9"
            />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    value={option.label}
                    key={option.value}
                    onSelect={() => {
                      field.onChange(option.value);
                    }}
                  >
                    {option.label}
                    <CheckIcon
                      className={cn('ml-auto h-4 w-4', option.value === field.value ? 'opacity-100' : 'opacity-0')}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

Combobox.displayName = 'Combobox';

export { Combobox };
