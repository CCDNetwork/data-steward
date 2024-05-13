import { useAuth } from '@/providers/GlobalProvider';

import { UserRole } from '@/services/users';

import { Navigate } from 'react-router-dom';
import { APP_ROUTE } from '@/helpers/constants';

export const RoleBasedIndexRoute = () => {
  const {
    user: { role },
  } = useAuth();

  switch (role) {
    case UserRole.Admin:
      return <Navigate to={APP_ROUTE.Organizations} replace />;

    case UserRole.User:
      return <Navigate to={APP_ROUTE.UserHandbookList} replace />;

    default:
      return <Navigate to={APP_ROUTE.UserHandbookList} replace />;
  }
};
