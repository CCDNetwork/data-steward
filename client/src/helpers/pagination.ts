import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { useSearchParams } from 'react-router-dom';

export interface DataWithMeta<T> {
  meta: MetaData;
  data: T[];
}

export interface MetaData {
  page: number;
  pageSize: number;
  sortBy: string | null;
  sortDirection: SortDirection | null;
  totalRows: number;
  totalPages: number;
}

export interface PaginationFilters {
  [key: string]: any;
}

export interface PaginationRequest {
  page: number;
  pageSize: number;
  search?: string;
  sortBy?: string;
  sortDirection?: SortDirection;
  filters?: PaginationFilters;
  queryFilters?: PaginationFilters;
  replaceSearchParam?: {
    key: string;
    value: string;
  };
}

export interface PaginationContext {
  currentPage: number;
  pageSize: number;
  sortBy: string;
  sortDirection: SortDirection;
  search: string;
  debouncedSearch: string;
  filters: PaginationFilters;
  queryFilters?: PaginationFilters;
  onSearchChange: (searchValue: string) => void;
  onPageChange: (newPage: number, params?: { [key: string]: any }) => void;
  onPageSizeChange: (newPageSize: number) => void;
  onSortChange: (accessorKey: string, sort: SortDirection) => void;
  onFiltersChange: (filters: PaginationFilters) => void;
  onQueryFiltersChange?: (filters: PaginationFilters) => void;
  reset: () => void;
}

export enum SortDirection {
  None = '',
  Asc = 'asc',
  Desc = 'desc',
}

export const initialPaginationRequest: PaginationRequest = {
  page: 1,
  pageSize: 10,
  search: '',
  sortBy: '',
  sortDirection: SortDirection.None,
};

type UsePaginationHookProps = {
  initialPagination?: Partial<PaginationContext>;
  useUrlParams?: boolean;
};

export const usePagination = (
  props: UsePaginationHookProps = {
    initialPagination: undefined,
    useUrlParams: true,
  }
) => {
  const { initialPagination, useUrlParams } = props;

  const [searchParams, setSearchParams] = useSearchParams({});
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get('page')) || initialPagination?.currentPage || 1
  );
  const [pageSize, setPageSize] = useState(
    Number(searchParams.get('pageSize')) || initialPagination?.pageSize || 10
  );
  const [sortBy, setSortBy] = useState(
    searchParams.get('sortBy') || initialPagination?.sortBy || ''
  );
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    (searchParams.get('sortDirection') as SortDirection) ||
      initialPagination?.sortDirection ||
      SortDirection.None
  );
  const [filters, setFilters] = useState<PaginationFilters>(
    initialPagination?.filters ?? {}
  );
  const [queryFilters, setQueryFilters] = useState<PaginationFilters>({});
  const [search, setSearch] = useState(searchParams.get('search') || '');

  const debouncedSearch = useDebounce<string>(search, 500);

  const removeAllSearchParams = () => {
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);
      const pageParam = newParams.get('page');
      if (pageParam) {
        newParams.delete('page');
      }
      const pageSizeParam = newParams.get('pageSize');
      if (pageSizeParam) {
        newParams.delete('pageSize');
      }
      const sortByParam = newParams.get('sortBy');
      if (sortByParam) {
        newParams.delete('sortBy');
      }
      const sortDirectionParam = newParams.get('sortDirection');
      if (sortDirectionParam) {
        newParams.delete('sortDirection');
      }
      const searchParam = newParams.get('search');
      if (searchParam) {
        newParams.delete('search');
      }
      return newParams;
    });
  };

  useEffect(() => {
    if (!useUrlParams) {
      removeAllSearchParams();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPageChange = (newPage: number) => {
    setCurrentPage(newPage);

    if (useUrlParams) {
      setSearchParams((prevParams) => {
        const newParams = new URLSearchParams(prevParams);
        newParams.set('page', newPage.toString());
        return newParams;
      });
    }
  };

  const onPageSizeChange = (newPageSize: number) => {
    setCurrentPage(1);
    setPageSize(newPageSize);

    if (useUrlParams) {
      setSearchParams((prevParams) => {
        const newParams = new URLSearchParams(prevParams);
        newParams.set('page', '1');
        newParams.set('pageSize', newPageSize.toString());
        return newParams;
      });
    }
  };

  const reset = () => {
    setCurrentPage(1);
    setPageSize(10);
    setSortBy('');
    setSortDirection(SortDirection.None);
    setSearch('');
  };

  const onSortChange = (accessorKey: string, sort: SortDirection) => {
    setCurrentPage(1);
    setSortBy(accessorKey);
    setSortDirection(sort);

    if (useUrlParams) {
      setSearchParams((prevParams) => {
        const newParams = new URLSearchParams(prevParams);
        newParams.set('page', '1');
        newParams.set('sortBy', accessorKey);
        newParams.set('sortDirection', sort);
        return newParams;
      });
    }
  };

  const onSearchChange = (searchValue: string) => {
    setCurrentPage(1);
    setSearch(searchValue);

    if (useUrlParams) {
      setSearchParams((prevParams) => {
        const newParams = new URLSearchParams(prevParams);
        newParams.set('page', '1');

        if (searchValue === '') {
          newParams.delete('search');
        } else {
          newParams.set('search', searchValue);
        }
        return newParams;
      });
    }
  };

  const onSearchReset = () => {
    setSearch('');
  };

  const pageReset = () => {
    setCurrentPage(1);
  };

  const onFiltersChange = (newFilters: PaginationFilters) => {
    setCurrentPage(1);
    setFilters(newFilters);
  };

  const onQueryFiltersChange = (newFilters: PaginationFilters) => {
    setCurrentPage(1);
    setQueryFilters(newFilters);
  };

  return {
    currentPage,
    pageSize,
    sortBy,
    sortDirection,
    search,
    debouncedSearch,
    onSearchChange,
    onPageChange,
    onPageSizeChange,
    onSortChange,
    onSearchReset,
    onFiltersChange,
    filters,
    setSearchParams,
    setFilters,
    pageReset,
    queryFilters,
    onQueryFiltersChange,
    reset,
  };
};

export const paginationRequestToUrl = (
  url: string,
  pagination: PaginationRequest,
  filtersTransformation?: (filters: PaginationFilters) => {
    [key: string]: any;
  }
) => {
  const separator = url.indexOf('?') === -1 ? '?' : '&';
  let newUrl = `${url}${separator}page=${pagination.page}&pageSize=${pagination.pageSize}`;

  if (pagination.sortBy) newUrl += `&sortBy=${pagination.sortBy}`;
  if (pagination.sortDirection)
    newUrl += `&sortDirection=${pagination.sortDirection}`;
  if (pagination.search && !pagination.replaceSearchParam)
    newUrl += `&search=${pagination.search}`;
  if (pagination.replaceSearchParam && pagination.replaceSearchParam.value) {
    newUrl += `&${pagination.replaceSearchParam.key}=${pagination.replaceSearchParam.value}`;
  }
  if (pagination.filters) {
    const transformedFilters = filtersTransformation
      ? filtersTransformation(pagination.filters)
      : pagination.filters;

    // remove empty values
    const preparedFilters = Object.keys(transformedFilters).reduce(
      (acc: any, key) => {
        if (transformedFilters[key] !== '' && transformedFilters[key] != null) {
          acc[key] = transformedFilters[key];
        }

        return acc;
      },
      {}
    );

    // filters are encoded as query params
    const filters = Object.keys(preparedFilters)
      .map((key) => `${key}=${preparedFilters?.[key]}`)
      .join(',');

    newUrl += `&filter=${encodeURI(filters)}`;
  }

  if (pagination.queryFilters) {
    const transformedQueryFilters = filtersTransformation
      ? filtersTransformation(pagination.queryFilters)
      : pagination.queryFilters;

    // remove empty values
    const preparedFQueryFilters = Object.keys(transformedQueryFilters).reduce(
      (acc: any, key) => {
        if (
          transformedQueryFilters[key] !== '' &&
          transformedQueryFilters[key] != null
        ) {
          acc[key] = transformedQueryFilters[key];
        }

        return acc;
      },
      {}
    );

    // queryFilters are encoded as query params
    const queryFilters = Object.keys(preparedFQueryFilters)
      .map((key) => `${key}=${preparedFQueryFilters?.[key]}`)
      .join('&');

    newUrl += `&${encodeURI(queryFilters)}`;
  }

  return newUrl;
};
