import { NavigationItem } from '@/helpers/types';
import { UserPermission } from '@/services/users';
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
  Users = '/users',
  MyProfile = '/my-profile',
  SignIn = '/sign-in',
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
  // PUBLIC
  PermissionDenied = '/permission-denied',
  ReferralData = '/referral-data',
}

export enum PAGE_TYPE {
  Create = 'new',
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    categoryName: 'Deduplication',
    userPermissions: [UserPermission.Deduplication],
    routes: [
      {
        name: 'Manage cases',
        to: APP_ROUTE.Deduplication,
        userPermissions: [UserPermission.Deduplication],
        icon: BookCopyIcon,
      },
      {
        name: 'Beneficiary List',
        to: APP_ROUTE.BeneficiaryList,
        icon: BookUserIcon,
        userPermissions: [UserPermission.Deduplication],
      },
      {
        name: 'Templates',
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
        name: 'Received',
        to: APP_ROUTE.ReceivedReferrals,
        icon: LogInIcon,
        userPermissions: [UserPermission.Referrals],
      },
      {
        name: 'Sent',
        to: APP_ROUTE.SentReferrals,
        icon: LogOutIcon,
        userPermissions: [UserPermission.Referrals],
      },
      {
        name: 'Service List',
        to: APP_ROUTE.ServiceList,
        icon: HeartHandshakeIcon,
        userPermissions: [UserPermission.Referrals],
      },
    ],
  },
  {
    categoryName: 'Admin',
    routes: [
      { name: 'Organisations', to: APP_ROUTE.Organizations, icon: Building2Icon },
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
