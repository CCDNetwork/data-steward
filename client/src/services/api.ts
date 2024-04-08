import axios from 'axios';

import { LocalStorage } from '@/helpers/localStorage';

export const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/v1`,
  timeout: 10000,
});

api.defaults.headers.common.Authorization = `Bearer ${LocalStorage.getToken()}`;
api.defaults.headers.common['organization-id'] = `${LocalStorage.getOrganization()?.id}`;

api.interceptors.response.use(
  (config) => config,
  (error) => {
    if (error.response !== undefined && error.response.status === 401) {
      LocalStorage.removeToken();
      LocalStorage.removeUser();
      LocalStorage.removeOrganization();
    }

    return Promise.reject(error);
  },
);

export const unauthorizedHandler = (logoutFc: () => void) => (error: any) => {
  if (error.response !== undefined && error.response.status === 401) {
    logoutFc();
  }

  return Promise.reject(error);
};
