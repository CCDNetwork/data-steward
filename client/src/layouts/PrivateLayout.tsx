import { useMemo, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';

import { useAuth } from '@/providers/GlobalProvider';
import { APP_ROUTE, NAVIGATION_ITEMS } from '@/helpers/constants';
import { UserRole } from '@/services/users';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

import { SidebarContent } from './SidebarContent';

interface Props {
  children?: React.ReactNode;
}

export const PrivateLayout = ({ children = <Outlet /> }: Props) => {
  const { isLoggedIn, user } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  const roleBasedNavigationItems = useMemo(() => {
    if (user.role === UserRole.User) {
      return NAVIGATION_ITEMS.filter((permissions) =>
        permissions?.userPermissions?.some((p) => user.permissions.includes(p)),
      );
    }

    return NAVIGATION_ITEMS;
  }, [user.permissions, user.role]);

  if (!user.id || !isLoggedIn) {
    return <Navigate to={APP_ROUTE.SignIn} />;
  }

  return (
    <div className="relative flex overflow-hidden h-[100svh]">
      {/* DESKTOP */}
      <div className="hidden md:flex w-[300px] z-10">
        <SidebarContent navigationItems={roleBasedNavigationItems} showHandbookRoute={user.role === UserRole.User} />
      </div>

      {/* MOBILE */}
      <Sheet open={mobileSidebarOpen}>
        <SheetTrigger
          onClick={() => setMobileSidebarOpen((old) => !old)}
          className="absolute top-1.5 left-3 bg-muted/50 p-1 rounded-md hover:bg-muted transition-colors duration-300 ease-in-out block md:hidden focus:outline-primary outline-none"
        >
          <HamburgerMenuIcon className="w-5 h-5 text-muted-foreground" />
        </SheetTrigger>
        <SheetContent onOverlayClick={() => setMobileSidebarOpen(false)} className="p-0 w-[300px] z-50" side="left">
          <SidebarContent
            closeSidebar={() => setMobileSidebarOpen(false)}
            navigationItems={roleBasedNavigationItems}
            showHandbookRoute={user.role === UserRole.User}
          />
        </SheetContent>
      </Sheet>

      <div className="divide-y divide-border flex-1 flex flex-col overflow-hidden">
        <div className="px-4 pt-2 pb-4 flex-1 overflow-y-auto md:mt-0 mt-10 border-t md:border-t-0">{children}</div>
        <div className="px-4 py-4 sm:px-6 min-h-[69px] flex items-center justify-center">
          <p className="font-medium tracking-tight text-muted-foreground">Footer Content</p>
        </div>
      </div>
    </div>
  );
};
