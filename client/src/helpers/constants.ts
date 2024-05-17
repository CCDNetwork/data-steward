import { NavigationItem } from '@/helpers/types';
import { UserRole } from '@/services/users';
import {
  BookCopyIcon,
  BookOpenTextIcon,
  BookUserIcon,
  Building2Icon,
  FilesIcon,
  HeartHandshakeIcon,
  LogInIcon,
  LogOutIcon,
  TextSelectIcon,
  UsersIcon,
} from 'lucide-react';

export enum APP_ROUTE {
  // PRIVATE
  // Dashboard = '/dashboard',
  Users = '/users',
  MyProfile = '/my-profile',
  SignIn = '/sign-in',
  Beneficiaries = '/beneficiaries',
  Deduplication = '/deduplication',
  Referrals = '/referrals',
  Attributes = '/attributes',
  Organizations = '/organizations',
  Handbook = '/handbook',
  UserHandbookList = '/handbook-list',
  Rules = '/rules',
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
    categoryName: 'Deduplication',
    allowedRoles: [UserRole.User, UserRole.Admin],
    routes: [
      {
        name: 'Manage cases',
        to: APP_ROUTE.Deduplication,
        allowedRoles: [UserRole.User, UserRole.Admin],
        icon: BookCopyIcon,
      },
      {
        name: 'Beneficiary List',
        to: APP_ROUTE.Beneficiaries,
        allowedRoles: [UserRole.User, UserRole.Admin],
        disabled: true,
        icon: BookUserIcon,
      },
      { name: 'Templates', to: APP_ROUTE.Templates, allowedRoles: [UserRole.User], icon: FilesIcon },
    ],
  },
  {
    categoryName: 'Referrals',
    allowedRoles: [UserRole.User, UserRole.Admin],
    routes: [
      {
        name: 'Received',
        to: APP_ROUTE.Referrals,
        allowedRoles: [UserRole.User, UserRole.Admin],
        disabled: true,
        icon: LogInIcon,
      },
      {
        name: 'Sent',
        to: APP_ROUTE.Referrals,
        allowedRoles: [UserRole.User, UserRole.Admin],
        disabled: true,
        icon: LogOutIcon,
      },
      {
        name: 'Service List',
        to: APP_ROUTE.Referrals,
        allowedRoles: [UserRole.User, UserRole.Admin],
        disabled: true,
        icon: HeartHandshakeIcon,
      },
    ],
  },
  {
    categoryName: 'Admin',
    allowedRoles: [UserRole.Admin],
    routes: [
      { name: 'Organizations', to: APP_ROUTE.Organizations, allowedRoles: [UserRole.Admin], icon: Building2Icon },
      { name: 'Users', to: APP_ROUTE.Users, allowedRoles: [UserRole.Admin], icon: UsersIcon },
      {
        name: 'Attributes',
        to: APP_ROUTE.Attributes,
        allowedRoles: [UserRole.Admin],
        icon: TextSelectIcon,
      },
      {
        name: 'Rules',
        to: APP_ROUTE.Rules,
        allowedRoles: [UserRole.Admin],
        icon: TextSelectIcon,
      },
      {
        name: 'Handbook entries',
        to: APP_ROUTE.Handbook,
        allowedRoles: [UserRole.Admin],
        icon: BookOpenTextIcon,
      },
    ],
  },
];
