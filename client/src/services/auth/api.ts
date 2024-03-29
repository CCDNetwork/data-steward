import { api } from '@/services';
import { useMutation } from '@tanstack/react-query';

import { resToAuthData } from './transformations';
import {
  AuthData,
  LoginRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  RegisterRequest,
  ActivateAccountRequest,
} from './types';

export const login = async (data: LoginRequest): Promise<AuthData> => {
  const resp = await api.post('/authentication/login', data);
  return resToAuthData(resp.data);
};

export const register = async (data: RegisterRequest): Promise<AuthData> => {
  const resp = await api.post('/authentication/registration', data);
  return resToAuthData(resp.data);
};

export const forgotPassword = async (data: ForgotPasswordRequest): Promise<object> => {
  const resp = await api.post('/authentication/forgot-password', data);
  return resp.data;
};

export const resetPassword = async (data: ResetPasswordRequest): Promise<object> => {
  const resp = await api.post('/authentication/reset-password', data);
  return resp.data;
};

export const activateAccount = async (data: ActivateAccountRequest): Promise<AuthData> => {
  const resp = await api.post('/authentication/activation', data);
  return resToAuthData(resp.data);
};

//
// Mutation hooks
//
export const useAuthMutation = () => {
  return {
    login: useMutation(login),
    forgotPassword: useMutation(forgotPassword),
    resetPassword: useMutation(resetPassword),
    activateAccount: useMutation(activateAccount),
    registerAccount: useMutation(register),
  };
};
