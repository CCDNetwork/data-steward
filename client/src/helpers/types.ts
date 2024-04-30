import { LucideIcon } from 'lucide-react';

export interface NavigationItem {
  name: string;
  to: string;
  icon?: LucideIcon;
  allowedRoles?: string[];
  disabled?: boolean;
}
