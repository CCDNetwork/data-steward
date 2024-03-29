import { NavigationItem } from '@/helpers/types';
import { UserRole } from '@/services/users';

export enum APP_ROUTE {
  // PRIVATE
  Dashboard = '/dashboard',
  Users = '/users',
  MyProfile = '/my-profile',
  SignIn = '/sign-in',
  Beneficiaries = '/beneficiaries',
  Deduplication = '/deduplication',
  Referrals = '/referrals',
  // PUBLIC
  ForgotPassword = '/forgot-password',
  ResetPassword = '/reset-password',
  SuccessPage = '/success',
  PermissionDenied = '/permission-denied',
  // Register = '/register',
  // ActivateAccount = '/activation',
  // RegistrationSuccess = '/registration-successful',
}

export enum PAGE_TYPE {
  Create = 'new',
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { name: 'Dashboard', to: APP_ROUTE.Dashboard, allowedRoles: [UserRole.Owner, UserRole.User] },
  { name: 'Beneficiaries', to: APP_ROUTE.Beneficiaries, allowedRoles: [UserRole.Owner, UserRole.User] },
  { name: 'Deduplication', to: APP_ROUTE.Deduplication, allowedRoles: [UserRole.Owner, UserRole.User] },
  { name: 'Referrals', to: APP_ROUTE.Referrals, allowedRoles: [UserRole.Owner, UserRole.User] },
];
