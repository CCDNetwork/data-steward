import { api } from '@/services';
import { useMutation } from '@tanstack/react-query';

import { resToAuthData } from './transformations';
import { AuthData, LoginRequest } from './types';

export const login = async (data: LoginRequest): Promise<AuthData> => {
  const resp = await api.post('/authentication/login', data);
  return resToAuthData(resp.data);
};

//
// Mutation hooks
//
export const useAuthMutation = () => {
  return {
    login: useMutation(login),
  };
};
