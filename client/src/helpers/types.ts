import { LucideIcon } from 'lucide-react';

export interface NavigationItem {
  categoryName: string;
  allowedRoles: string[];
  routes: {
    name: string;
    to: string;
    icon: LucideIcon;
    allowedRoles?: string[];
    disabled?: boolean;
  }[];
}

export interface IBreadCrumb {
  href?: string;
  name: string;
}
