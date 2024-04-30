import { NavigationItem } from '@/helpers/types';
import { UserRole } from '@/services/users';
import {
  BookCopyIcon,
  BookUserIcon,
  Building2Icon,
  FilesIcon,
  HeartHandshakeIcon,
  TextSelectIcon,
  UsersIcon,
} from 'lucide-react';

export enum APP_ROUTE {
  // PRIVATE
  Dashboard = '/dashboard',
  Users = '/users',
  MyProfile = '/my-profile',
  SignIn = '/sign-in',
  Beneficiaries = '/beneficiaries',
  Deduplication = '/deduplication',
  Referrals = '/referrals',
  BeneficiaryAttributes = '/beneficiary-attributes',
  Organizations = '/organizations',
  // PUBLIC
  ForgotPassword = '/forgot-password',
  ResetPassword = '/reset-password',
  SuccessPage = '/success',
  PermissionDenied = '/permission-denied',
  Templates = '/templates',
}

export enum PAGE_TYPE {
  Create = 'new',
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    name: 'Deduplication',
    to: APP_ROUTE.Deduplication,
    allowedRoles: [UserRole.Owner, UserRole.User],
    icon: BookCopyIcon,
  },
  { name: 'Templates', to: APP_ROUTE.Templates, allowedRoles: [UserRole.User], icon: FilesIcon },
  {
    name: 'Beneficiaries',
    to: APP_ROUTE.Beneficiaries,
    allowedRoles: [UserRole.Owner, UserRole.User],
    disabled: true,
    icon: BookUserIcon,
  },
  {
    name: 'Referrals',
    to: APP_ROUTE.Referrals,
    allowedRoles: [UserRole.Owner, UserRole.User],
    disabled: true,
    icon: HeartHandshakeIcon,
  },
  { name: 'Organizations', to: APP_ROUTE.Organizations, allowedRoles: [UserRole.Admin], icon: Building2Icon },
  { name: 'Users', to: APP_ROUTE.Users, allowedRoles: [UserRole.Admin], icon: UsersIcon },
  {
    name: 'Beneficiary Attributes',
    to: APP_ROUTE.BeneficiaryAttributes,
    allowedRoles: [UserRole.Admin],
    icon: TextSelectIcon,
  },
];
