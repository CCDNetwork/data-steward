import * as React from 'react';
import { CheckIcon, PlusCircledIcon } from '@radix-ui/react-icons';
import { cn } from '@/helpers/utils';

import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '../ui/command';

interface FilterDropdownProps {
  filterName: string;
  title: string;
  options: {
    label: string;
    value: string;
  }[];
  currentFilters: Record<string, string>;
  setCurrentFilters: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;
}

export const FilterDropdown = ({
  filterName,
  title,
  options,
  currentFilters,
  setCurrentFilters,
}: FilterDropdownProps) => {
  let currentFilterValues;

  if (currentFilters[filterName]) {
    currentFilterValues = currentFilters[filterName].split('|');
  } else {
    currentFilterValues = [''];
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="border-dashed">
          <PlusCircledIcon className="mr-2 h-4 w-4" />
          {title}
          {currentFilters[filterName] && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <div className="space-x-1 flex">
                {currentFilterValues.length > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {currentFilterValues.length} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) =>
                      currentFilterValues.includes(option.value),
                    )
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="end">
        <Command>
          <CommandInput
            className="focus:border-none px-0 border-none outline-none focus:outline-none ring-0 focus:ring-0"
            placeholder={title}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = currentFilterValues.find(
                  (i) => i === option.value,
                );
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      if (isSelected) {
                        setCurrentFilters((old) => ({
                          ...old,
                          [filterName]: currentFilterValues
                            .filter((i) => i !== option.value)
                            .join('|'),
                        }));
                      } else {
                        setCurrentFilters((old) => ({
                          ...old,
                          [filterName]:
                            currentFilterValues.length >= 1
                              ? [...currentFilterValues, option.value]
                                  .filter((i) => i !== '')
                                  .join('|')
                              : option.value,
                        }));
                      }
                    }}
                  >
                    <div
                      className={cn(
                        'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'opacity-50 [&_svg]:invisible',
                      )}
                    >
                      <CheckIcon className={cn('h-4 w-4')} />
                    </div>
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {currentFilters[filterName] && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() =>
                      setCurrentFilters((old) => ({ ...old, [filterName]: '' }))
                    }
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
