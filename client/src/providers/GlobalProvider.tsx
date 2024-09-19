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
import { Organization } from '@/services/organizations';
import { useOrganizationMe } from '@/services/organizations/api';
import { useUserMe } from '@/services/users/api';
import { Settings } from '@/services/settings/types';
import { useSettings } from '@/services/settings';

const GlobalContext = createContext<{
  isLoggedIn: boolean;
  user: User;
  organization: Organization | null;
  collectionNotFound: boolean;
  token: string | null;
  isOrganizationQueryLoading: boolean;
  deploymentSettings: Settings | null;
  loginUser: (authData: AuthData) => void;
  logoutUser: () => void;
  updateUser: (user: User) => void;
  updateOrganization: (organization: Organization) => void;
  setUser: Dispatch<SetStateAction<User>>;
  onSetCollectionNotFound: (value: boolean) => void;
}>(undefined as any);

export const GlobalProvider = ({ children = <Outlet /> }: Props) => {
  const queryClient = useQueryClient();
  const [isLoggedIn, setIsLoggedIn] = useState(!!LocalStorage.getToken());
  const [user, setUser] = useState<User>(LocalStorage.getUser());
  const [organization, setOrganization] = useState<Organization | null>(
    LocalStorage.getOrganization()
  );
  const [deploymentSettings, setDeploymentSettings] = useState<Settings | null>(
    null
  );
  const [token, setToken] = useState<string | null>(LocalStorage.getToken());
  const [collectionNotFound, setCollectionNotFound] = useState(false);

  const { refetch: getLoggedInUser, data: loggedInUser } = useUserMe({
    queryEnabled: false,
  });
  const { refetch: getDeploymentSettings } = useSettings({
    queryEnabled: false,
    onSuccessCallback: setDeploymentSettings,
  });
  const {
    refetch: getLoggedInOrganization,
    data: loggedInOrganization,
    isLoading: isOrganizationQueryLoading,
  } = useOrganizationMe({ queryEnabled: false });

  const logoutUser = useCallback(() => {
    api.defaults.headers.common.Authorization = '';
    LocalStorage.removeToken();
    queryClient.removeQueries();
    setUser(initialUser);
    setOrganization(null);
    setIsLoggedIn(false);
  }, [queryClient]);

  const loginUser = useCallback((authData: AuthData) => {
    api.defaults.headers.common.Authorization = `Bearer ${authData.token}`;
    LocalStorage.setToken(authData.token);
    setToken(authData.token);
    setUser(authData.user);
    setOrganization(authData.organization);
    setIsLoggedIn(true);
  }, []);

  const updateUser = useCallback((updatedUser: User) => {
    LocalStorage.setUser(updatedUser);
    setUser(updatedUser);
  }, []);

  const updateOrganization = useCallback(
    (updatedOrganization: Organization) => {
      setOrganization(updatedOrganization);
    },
    []
  );

  // Handle document title based on deployment settings
  useEffect(() => {
    document.title = deploymentSettings?.deploymentName ?? '';
  }, [deploymentSettings?.deploymentName]);

  // Handle when server returns 401
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (config) => config,
      unauthorizedHandler(logoutUser)
    );
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

    if (organization) {
      api.defaults.headers.common['organization-id'] =
        organization.id.toString();
      LocalStorage.setOrganization(organization);
    } else {
      api.defaults.headers.common['organization-id'] = '';
      LocalStorage.removeOrganization();
    }
  }, [user, organization]);

  const onSetCollectionNotFound = (value: boolean) => {
    setCollectionNotFound(value);
  };

  useEffect(() => {
    if (isLoggedIn) {
      getLoggedInUser();
      getLoggedInOrganization();
      getDeploymentSettings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  useEffect(() => {
    if (loggedInUser) {
      LocalStorage.setUser(loggedInUser);
      setUser(loggedInUser);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedInUser]);

  useEffect(() => {
    if (loggedInOrganization) {
      LocalStorage.setOrganization(loggedInOrganization);
      setOrganization(loggedInOrganization);
    }
  }, [loggedInOrganization]);

  // Wrapped in useMemo because re-rendering cycles
  const value = useMemo(
    () => ({
      user,
      collectionNotFound,
      isLoggedIn,
      token,
      organization,
      isOrganizationQueryLoading,
      deploymentSettings,
      loginUser,
      logoutUser,
      updateUser,
      setUser,
      updateOrganization,
      onSetCollectionNotFound,
    }),
    [
      isLoggedIn,
      organization,
      user,
      collectionNotFound,
      token,
      isOrganizationQueryLoading,
      deploymentSettings,
      loginUser,
      logoutUser,
      updateUser,
      updateOrganization,
    ]
  );

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};

export const useGlobalProvider = () => {
  return useContext(GlobalContext);
};

export const useAuth = () => {
  const {
    isLoggedIn,
    organization,
    user,
    token,
    deploymentSettings,
    updateOrganization,
    loginUser,
    logoutUser,
    updateUser,
    setUser,
  } = useGlobalProvider();
  return {
    isLoggedIn,
    user,
    token,
    organization,
    deploymentSettings,
    loginUser,
    logoutUser,
    updateUser,
    updateOrganization,
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
