import { useMemo, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Control, useController } from 'react-hook-form';
import Select, { MultiValue, SingleValue } from 'react-select';
import { cn } from '@/helpers/utils';
import { DataWithMeta, PaginationRequest } from '@/helpers/pagination';

export const AsyncSelect = <T,>({
  control,
  name,
  multiple,
  wrapperClassName,
  labelClassName,
  label,
  options: propsOptions = [],
  valueKey,
  labelKey,
  required,
  disabled,
  queryFilters,
  getOptionLabel = (option) => option[labelKey] as string,
  useInfiniteQueryFunction,
  onChange,
  initialPagination,
  requiredField,
  useValue = false,
  defaultValue = null,
}: AsyncSelectProps<T>) => {
  const [wasOpened, setWasOpened] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const debouncedSearch = useDebounce(search, 300);

  const query = useInfiniteQueryFunction?.(
    {
      ...initialPagination,
      pageSize: 25,
      page: 1,
      search: debouncedSearch,
      queryFilters,
    },
    wasOpened,
  );

  const { field, fieldState } = useController({ control, name });

  const { value, onChange: formOnChange } = field;

  const selectedValue = useMemo(() => {
    if (!useInfiniteQueryFunction) {
      if (useValue && valueKey && !Array.isArray(value)) {
        return propsOptions.find((option) => option[valueKey] === value);
      }

      return value;
    }

    return value;
  }, [propsOptions, value, useValue, valueKey, useInfiniteQueryFunction]);

  const options = useMemo(() => {
    return useInfiniteQueryFunction ? query?.data?.pages.flatMap((page) => page.data) ?? [] : propsOptions;
  }, [query?.data?.pages, propsOptions, useInfiniteQueryFunction]);

  const handleChange = (newValue: MultiValue<T> | SingleValue<T>) => {
    if (useValue && valueKey && !Array.isArray(newValue)) {
      formOnChange(newValue ? (newValue as T)[valueKey] : defaultValue);
    } else {
      formOnChange(newValue);
    }
    onChange?.(newValue as T);
  };

  const handleScrollToBottom = () => {
    query?.fetchNextPage();
  };

  const handleMenuOpen = () => {
    setWasOpened(true);
    setIsOpen(true);
  };

  const handleMenuClose = () => {
    setIsOpen(false);
  };

  const handleInputChange = (newValue: string) => {
    setSearch(newValue);
  };

  return (
    <div className={cn('relative w-full react-select-container', wrapperClassName)}>
      {label && (
        <label
          htmlFor={name}
          className={cn(
            'block text-sm pb-3 font-bold tracking-tight leading-6',
            { 'after:content-["_*"] after:text-red-500': requiredField },
            labelClassName,
          )}
        >
          {label}
        </label>
      )}
      <Select
        isMulti={multiple}
        value={selectedValue}
        getOptionLabel={getOptionLabel}
        getOptionValue={(option) => option[valueKey] as string}
        onChange={handleChange}
        options={options}
        isClearable={!required}
        onMenuScrollToBottom={handleScrollToBottom}
        onMenuOpen={handleMenuOpen}
        onMenuClose={handleMenuClose}
        isDisabled={disabled}
        isLoading={isOpen && query?.isLoading}
        onInputChange={handleInputChange}
        maxMenuHeight={250}
        theme={(theme) => ({
          ...theme,
          borderRadius: 6,
          colors: {
            primary: 'bg-primary',
            danger: 'bg-destructive',
            primary25: 'bg-primary/20',
            primary50: 'bg-primary/50',
            primary75: 'bg-primary/80',
            neutral0: 'bg-transparent',
            neutral5: 'bg-background/5',
            neutral10: 'bg-background/10',
            neutral20: 'bg-background/20',
            neutral30: 'bg-background/30',
            neutral40: 'bg-background/40',
            neutral50: 'bg-background/50',
            neutral60: 'bg-background/60',
            neutral70: 'bg-background/70',
            neutral80: 'bg-background/80',
            neutral90: 'bg-background/90',
            dangerLight: 'bg-destructive/80',
          },
        })}
        classNames={{
          container: () => (disabled ? '!pointer-events-auto' : ''),
          control: (state) =>
            state.isFocused
              ? 'border border-primary outline-none ring-1 ring-ring'
              : disabled
                ? '!cursor-not-allowed'
                : 'border-border',
          input: () => 'text-sm',
          indicatorSeparator: () => 'bg-muted-foreground',
          dropdownIndicator: (state) =>
            state.selectProps.menuIsOpen ? 'rotate-180' : disabled ? 'text-muted-foreground' : '',
          singleValue: () => (disabled ? 'text-sm text-muted-foreground' : 'text-sm'),
          placeholder: () => 'text-sm text-muted-foreground',
          menu: () => 'text-sm bg-background border border-border',
          option: (state) => (state.isSelected ? 'text-primary font-bold hover:bg-muted' : 'bg-muted'),
        }}
      />
      {!!fieldState.error && (
        <p className="text-destructive text-[0.8rem] mt-2 font-medium">{fieldState.error.message}</p>
      )}
    </div>
  );
};

export type AsyncSelectProps<T> = {
  control: Control<any, any>;
  name: string;
  multiple?: boolean;
  wrapperClassName?: string;
  labelClassName?: string;
  label?: string;
  valueKey: keyof T;
  labelKey: keyof T;
  disabled?: boolean;
  required?: boolean;
  useInfiniteQueryFunction?: (
    pagination: PaginationRequest,
    enabled: boolean,
  ) => ReturnType<typeof useInfiniteQuery<DataWithMeta<T>>>;
  options?: T[];
  getOptionLabel?: (option: T) => string;
  onChange?: (value: T | null) => void;
  initialPagination?: Partial<PaginationRequest>;
  useValue?: boolean;
  defaultValue?: any;
  queryFilters?: Record<string, string>;
  requiredField?: boolean;
};
