import { NavigationItem } from '@/helpers/types';
import { UserPermission } from '@/services/users';
import {
  BookCopyIcon,
  BookOpenTextIcon,
  BookUserIcon,
  Building2Icon,
  FilesIcon,
  LogInIcon,
  LogOutIcon,
  TextSelectIcon,
  UsersIcon,
} from 'lucide-react';

export enum PAGE_TYPE {
  Create = 'new',
}

export enum APP_ROUTE {
  // PRIVATE
  Users = '/users',
  MyProfile = '/my-profile',
  BeneficiaryList = '/beneficiary-list',
  Deduplication = '/deduplication',
  SentReferrals = '/sent-referrals',
  ReceivedReferrals = '/received-referrals',
  ServiceList = '/service-list',
  Organizations = '/organizations',
  Handbook = '/handbook',
  UserHandbookList = '/handbook-list',
  Rules = '/rules',
  Templates = '/templates',
  Dashboard = '/dashboard',
  Settings = '/settings',
  // PUBLIC
  SignIn = '/sign-in',
  PermissionDenied = '/permission-denied',
  ReferralData = '/referral-data',
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    categoryName: 'Deduplication',
    userPermissions: [UserPermission.Deduplication],
    routes: [
      {
        name: 'Deduplicate Cases',
        to: APP_ROUTE.Deduplication,
        userPermissions: [UserPermission.Deduplication],
        icon: BookCopyIcon,
      },
      {
        name: 'Manage Duplicates',
        to: APP_ROUTE.BeneficiaryList,
        icon: BookUserIcon,
        userPermissions: [UserPermission.Deduplication],
      },
      {
        name: 'Manage Templates',
        to: APP_ROUTE.Templates,
        icon: FilesIcon,
        userPermissions: [UserPermission.Deduplication],
      },
    ],
  },
  {
    categoryName: 'Referrals',
    userPermissions: [UserPermission.Referrals],
    routes: [
      {
        name: 'Manage Received',
        to: APP_ROUTE.ReceivedReferrals,
        icon: LogInIcon,
        userPermissions: [UserPermission.Referrals],
      },
      {
        name: 'Manage Sent',
        to: APP_ROUTE.SentReferrals,
        icon: LogOutIcon,
        userPermissions: [UserPermission.Referrals],
      },
      // {
      //   name: 'Service List',
      //   to: APP_ROUTE.ServiceList,
      //   icon: HeartHandshakeIcon,
      //   userPermissions: [UserPermission.Referrals],
      // },
    ],
  },
  {
    categoryName: 'Admin',
    routes: [
      {
        name: 'Organisations',
        to: APP_ROUTE.Organizations,
        icon: Building2Icon,
      },
      { name: 'Users', to: APP_ROUTE.Users, icon: UsersIcon },
      {
        name: 'Rules',
        to: APP_ROUTE.Rules,

        icon: TextSelectIcon,
      },
      {
        name: 'Handbook entries',
        to: APP_ROUTE.Handbook,
        icon: BookOpenTextIcon,
      },
    ],
  },
];
