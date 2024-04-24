import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { DataWithMeta, PaginationRequest, paginationRequestToUrl } from '@/helpers/pagination';
import { useGlobalErrors } from '@/providers/GlobalProvider';

import { api } from '../api';
import { Template } from './types';
import { resToTemplate, templateToReq } from './transformations';
import { TemplateForm } from '@/modules/Templates';

enum QueryKeys {
  Templates = 'templates',
  SingleTemplate = 'single_template',
}

//
// API calls
//
export const fetchTemplates = async (pagination: PaginationRequest): Promise<DataWithMeta<Template>> => {
  const url = paginationRequestToUrl('templates', pagination);

  const resp = await api.get(url);
  return {
    meta: resp.data.meta,
    data: resp.data.data?.map(resToTemplate) ?? [],
  };
};

const fetchTemplate = async (id: string): Promise<Template> => {
  const resp = await api.get(`/templates/${id}`);
  return resToTemplate(resp.data);
};

const postTemplate = async (data: TemplateForm): Promise<Template> => {
  const resp = await api.post(`/templates`, templateToReq(data));
  return resToTemplate(resp.data);
};

const patchTemplate = async ({ data, templateId }: { data: TemplateForm; templateId: string }): Promise<Template> => {
  const resp = await api.patch(`/templates/${templateId}`, templateToReq(data));
  return resToTemplate(resp.data);
};

const deleteTemplate = async (templateId: string): Promise<Template> => {
  const resp = await api.delete(`/templates/${templateId}`);
  return resToTemplate(resp.data);
};

//
// GET hooks
//

export const useTemplates = ({ currentPage, pageSize, sortBy, sortDirection, debouncedSearch }: any) => {
  return useQuery([QueryKeys.Templates, currentPage, pageSize, sortBy, sortDirection, debouncedSearch], () =>
    fetchTemplates({ page: currentPage, pageSize, sortBy, sortDirection, search: debouncedSearch }),
  );
};

export const useTemplate = ({ id, isCreate }: { id: string; isCreate: boolean }) => {
  const { onSetCollectionNotFound } = useGlobalErrors();

  return useQuery([QueryKeys.SingleTemplate, id], () => fetchTemplate(id), {
    enabled: !isCreate,
    onError: () => onSetCollectionNotFound(true),
  });
};

export const useTemplatesInfinite = (pagination: PaginationRequest, enabled: boolean) => {
  return useInfiniteQuery(
    [QueryKeys.Templates, 'infinite', pagination],
    ({ pageParam = 1 }) => {
      return fetchTemplates({ ...pagination, page: pageParam });
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
    },
  );
};

//
// Mutation hooks
//

export const useTemplateMutation = () => {
  const queryClient = useQueryClient();

  return {
    createTemplate: useMutation(postTemplate, {
      onSuccess: () => queryClient.invalidateQueries([QueryKeys.Templates]),
    }),
    editTemplate: useMutation(patchTemplate, {
      onSuccess: () => queryClient.invalidateQueries([QueryKeys.SingleTemplate]),
    }),
    deleteTemplate: useMutation(deleteTemplate, {
      onSuccess: () => queryClient.invalidateQueries([QueryKeys.Templates]),
    }),
  };
};
