import {
  createContext,
  useMemo,
  useState,
  useCallback,
  useEffect,
  ReactNode,
  useContext,
  Dispatch,
  SetStateAction,
} from 'react';
import { Outlet } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

import { api, unauthorizedHandler } from '@/services';
import { AuthData } from '@/services/auth';
import { User, initialUser } from '@/services/users';
import { LocalStorage } from '@/helpers/localStorage';
import { Tenant } from '@/services/tenants';
import { useTenantMe } from '@/services/tenants/api';
import { useUserMe } from '@/services/users/api';

const GlobalContext = createContext<{
  isLoggedIn: boolean;
  user: User;
  tenant: Tenant | null;
  collectionNotFound: boolean;
  token: string | null;
  isTenantQueryLoading: boolean;
  loginUser: (authData: AuthData) => void;
  logoutUser: () => void;
  updateUser: (user: User) => void;
  updateTenant: (tenant: Tenant) => void;
  setUser: Dispatch<SetStateAction<User>>;
  onSetCollectionNotFound: (value: boolean) => void;
}>(undefined as any);

export const GlobalProvider = ({ children = <Outlet /> }: Props) => {
  const queryClient = useQueryClient();
  const [isLoggedIn, setIsLoggedIn] = useState(!!LocalStorage.getToken());
  const [user, setUser] = useState<User>(LocalStorage.getUser());
  const [tenant, setTenant] = useState<Tenant | null>(LocalStorage.getTenant());
  const [token, setToken] = useState<string | null>(LocalStorage.getToken());
  const [collectionNotFound, setCollectionNotFound] = useState(false);

  const { refetch: getLoggedInUser, data: loggedInUser } = useUserMe({ queryEnabled: false });
  const {
    refetch: getLoggedInTenant,
    data: loggedInTenant,
    isLoading: isTenantQueryLoading,
  } = useTenantMe({ queryEnabled: false });

  const logoutUser = useCallback(() => {
    api.defaults.headers.common.Authorization = '';
    LocalStorage.removeToken();
    queryClient.removeQueries();
    setUser(initialUser);
    setTenant(null);
    setIsLoggedIn(false);
  }, [queryClient]);

  const loginUser = useCallback((authData: AuthData) => {
    api.defaults.headers.common.Authorization = `Bearer ${authData.token}`;
    LocalStorage.setToken(authData.token);
    setToken(authData.token);
    setUser(authData.user);
    setTenant(authData.tenant);
    setIsLoggedIn(true);
  }, []);

  const updateUser = useCallback((updatedUser: User) => {
    LocalStorage.setUser(updatedUser);
    setUser(updatedUser);
  }, []);

  const updateTenant = useCallback((updatedTenant: Tenant) => {
    setTenant(updatedTenant);
  }, []);

  // Handle when server returns 401
  useEffect(() => {
    const interceptor = api.interceptors.response.use((config) => config, unauthorizedHandler(logoutUser));
    return () => {
      api.interceptors.request.eject(interceptor);
    };
  }, [logoutUser]);

  // Sync user state with local storage
  useEffect(() => {
    if (user) {
      LocalStorage.setUser(user);
    } else {
      LocalStorage.removeUser();
    }

    if (tenant) {
      api.defaults.headers.common['tenant-id'] = tenant.id.toString();
      LocalStorage.setTenant(tenant);
    } else {
      api.defaults.headers.common['tenant-id'] = '';
      LocalStorage.removeTenant();
    }
  }, [user, tenant]);

  const onSetCollectionNotFound = (value: boolean) => {
    setCollectionNotFound(value);
  };

  useEffect(() => {
    if (isLoggedIn) {
      getLoggedInUser();
      getLoggedInTenant();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  useEffect(() => {
    if (loggedInUser) {
      LocalStorage.setUser(loggedInUser);
      setUser(loggedInUser);
    }
  }, [loggedInUser]);

  useEffect(() => {
    if (loggedInTenant) {
      LocalStorage.setTenant(loggedInTenant);
      setTenant(loggedInTenant);
    }
  }, [loggedInTenant]);

  // Wrapped in useMemo because re-rendering cycles
  const value = useMemo(
    () => ({
      user,
      collectionNotFound,
      isLoggedIn,
      token,
      tenant,
      isTenantQueryLoading,
      loginUser,
      logoutUser,
      updateUser,
      setUser,
      updateTenant,
      onSetCollectionNotFound,
    }),
    [
      isLoggedIn,
      tenant,
      user,
      collectionNotFound,
      token,
      isTenantQueryLoading,
      loginUser,
      logoutUser,
      updateUser,
      updateTenant,
    ],
  );

  return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>;
};

export const useGlobalProvider = () => {
  return useContext(GlobalContext);
};

export const useAuth = () => {
  const { isLoggedIn, tenant, user, token, updateTenant, loginUser, logoutUser, updateUser, setUser } =
    useGlobalProvider();
  return {
    isLoggedIn,
    user,
    token,
    tenant,
    loginUser,
    logoutUser,
    updateUser,
    updateTenant,
    setUser,
  };
};

export const useGlobalErrors = () => {
  const { collectionNotFound, onSetCollectionNotFound } = useGlobalProvider();
  return { collectionNotFound, onSetCollectionNotFound };
};

interface Props {
  children?: ReactNode;
}
