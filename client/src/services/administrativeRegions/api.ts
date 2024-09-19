import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import {
  DataWithMeta,
  PaginationRequest,
  paginationRequestToUrl,
} from '@/helpers/pagination';

import { AdministrativeRegion } from './types';
import { resToAdministrativeRegion } from './transformations';
import { api } from '../api';

enum QueryKeys {
  AdministrativeRegionKey = 'administrativeRegion_query',
}

//
// API calls
//

export const fetchAdministrativeRegions = async (
  pagination: PaginationRequest
): Promise<DataWithMeta<AdministrativeRegion>> => {
  const url = paginationRequestToUrl('admin-regions', pagination);
  const resp = await api.get(url);

  return {
    meta: resp.data.meta,
    data: resp.data.data?.map(resToAdministrativeRegion) ?? [],
  };
};

//
// GET hooks
//

export const useAdminRegionsInfinite = (
  pagination: PaginationRequest,
  enabled: boolean
) => {
  return useInfiniteQuery(
    [QueryKeys.AdministrativeRegionKey, 'infinite', pagination],
    ({ pageParam = 1 }) => {
      return fetchAdministrativeRegions({ ...pagination, page: pageParam });
    },
    {
      getNextPageParam: (data) => {
        if (data.meta.page === data.meta.totalPages) {
          return undefined;
        }
        const nextPage = data.meta.page + 1;
        return nextPage;
      },
      enabled,
      cacheTime: 20000,
    }
  );
};
export const useAdministrativeRegions = ({
  currentPage,
  pageSize,
  sortBy,
  sortDirection,
  debouncedSearch,
  filters,
  queryFilters,
}: any) => {
  return useQuery(
    [
      QueryKeys.AdministrativeRegionKey,
      currentPage,
      pageSize,
      sortBy,
      sortDirection,
      debouncedSearch,
      filters,
      queryFilters,
    ],
    () =>
      fetchAdministrativeRegions({
        page: currentPage,
        pageSize,
        sortBy,
        sortDirection,
        search: debouncedSearch,
        filters,
        queryFilters,
      })
  );
};
