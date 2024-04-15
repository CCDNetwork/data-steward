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
  getOptionLabel = (option) => option[labelKey] as string,
  useInfiniteQueryFunction,
  onChange,
  initialPagination,
  useValue = false,
  defaultValue = null,
}: Select2Props<T>) => {
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
    <div className={cn('relative rounded-md w-full react-select-container', wrapperClassName)}>
      {label && (
        <label htmlFor={name} className={cn('block text-sm mb-1 font-medium', labelClassName)}>
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
        classNames={{
          input: () => 'text-sm',
          singleValue: () => 'text-sm',
          placeholder: () => 'text-sm',
          menu: () => 'text-sm',
        }}
      />
      {!!fieldState.error && <p className="text-error-main text-sm mt-0.5 font-medium">{fieldState.error.message}</p>}
    </div>
  );
};

export type Select2Props<T> = {
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
};
