import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { DataWithMeta, PaginationRequest, paginationRequestToUrl } from '@/helpers/pagination';
import { useGlobalErrors } from '@/providers/GlobalProvider';

import { resToUser, userToReq } from './transformations';
import { User, UserProfileRequestPayload } from './types';
import { api } from '../api';

enum QueryKeys {
  Users = 'users',
  UserSingle = 'users_single',
  UserMe = 'user_me',
}

//
// API calls
//
export const fetchUsers = async (pagination: PaginationRequest): Promise<DataWithMeta<User>> => {
  const url = paginationRequestToUrl('users', pagination);

  const resp = await api.get(url);
  return {
    meta: resp.data.meta,
    data: resp.data.data?.map(resToUser) ?? [],
  };
};

const fetchUser = async (id: string): Promise<User> => {
  const resp = await api.get(`/users/${id}`);
  return resToUser(resp.data);
};

const postUser = async (data: any): Promise<User> => {
  const resp = await api.post(`/users`, userToReq(data));
  return resToUser(resp.data);
};

const putUser = async (data: any & { id: string }): Promise<User> => {
  const resp = await api.put(`/users/${data.id}`, userToReq(data));
  return resToUser(resp.data);
};

const deleteUser = async (id: string): Promise<User> => {
  const resp = await api.delete(`/users/${id}`);
  return resToUser(resp.data);
};

// user-me enpoints
const fetchUserMe = async (): Promise<User> => {
  const resp = await api.get('/users/me');
  return resToUser(resp.data);
};

const putUserMe = async (data: UserProfileRequestPayload): Promise<User> => {
  const resp = await api.put(`/users/me`, userToReq(data));
  return resToUser(resp.data);
};

//
// GET hooks
//

export const useUserMe = ({ queryEnabled = true }: { queryEnabled?: boolean }) => {
  return useQuery([QueryKeys.UserMe], () => fetchUserMe(), {
    enabled: queryEnabled,
  });
};

export const useUsers = ({ currentPage, pageSize, sortBy, sortDirection, debouncedSearch }: any) => {
  return useQuery([QueryKeys.Users, currentPage, pageSize, sortBy, sortDirection, debouncedSearch], () =>
    fetchUsers({ page: currentPage, pageSize, sortBy, sortDirection, search: debouncedSearch }),
  );
};

export const useUser = ({ id, isCreate }: { id: string; isCreate: boolean }) => {
  const { onSetCollectionNotFound } = useGlobalErrors();

  return useQuery([QueryKeys.UserSingle, id], () => fetchUser(id), {
    enabled: !isCreate,
    onError: () => onSetCollectionNotFound(true),
  });
};

//
// Mutation hooks
//

export const useUserMutation = () => {
  const queryClient = useQueryClient();

  return {
    addUser: useMutation(postUser, {
      onSuccess: () => queryClient.invalidateQueries([QueryKeys.Users]),
    }),
    editUser: useMutation(putUser, {
      onSuccess: () => queryClient.invalidateQueries([QueryKeys.Users]),
    }),
    deleteUser: useMutation(deleteUser, {
      onSuccess: () => queryClient.invalidateQueries([QueryKeys.Users]),
    }),
    editUserMe: useMutation(putUserMe, {
      onSuccess: () => queryClient.invalidateQueries([QueryKeys.UserMe]),
    }),
  };
};
