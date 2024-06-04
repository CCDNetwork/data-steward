import { LucideIcon } from 'lucide-react';

export interface NavigationItem {
  categoryName: string;
  userPermissions?: string[];
  routes: {
    name: string;
    to: string;
    icon: LucideIcon;
    userPermissions?: string[];
  }[];
}

export interface IBreadCrumb {
  href?: string;
  name: string;
}
