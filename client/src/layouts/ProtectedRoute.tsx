import { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '@/providers/GlobalProvider';
import { UserRole } from '@/services/users';

export const ProtectedRoute = ({ children = <Outlet />, rolesAllowed }: Props) => {
  const { user } = useAuth();

  if (!(rolesAllowed.length === 0 || rolesAllowed.includes(user?.role as UserRole))) {
    return <Navigate to="/permission-denied" replace />;
  }

  return <>{children}</>;
};

type Props = {
  children?: ReactNode;
  rolesAllowed: UserRole[];
};
