import { BookOpenTextIcon } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';

import { MyProfileItemWithDropdown } from '@/components/MyProfileItemWithDropdown';
import { Separator } from '@/components/ui/separator';
import { NavigationItem } from '@/helpers/types';
import { cn } from '@/helpers/utils';
import { APP_ROUTE } from '@/helpers/constants';

export const SidebarContent = ({
  navigationItems,
  showHandbookRoute,
  closeSidebar,
}: {
  showHandbookRoute: boolean;
  navigationItems: NavigationItem[];
  closeSidebar?: () => void;
}) => {
  const { pathname } = useLocation();

  return (
    <div className="flex h-full grow flex-col overflow-hidden bg-primary/5 border-r border-border px-6">
      <div className="flex mt-4 -ml-1 shrink-0 items-center">
        <NavLink to="/" onClick={closeSidebar} className="flex-shrink-0">
          <img className="h-12 object-contain grayscale dark:brightness-[20]" src="/ccd_logo.png" alt="CCD Logo" />
        </NavLink>
      </div>
      {showHandbookRoute && (
        <div className="-mx-2 mt-3">
          <NavLink
            to={APP_ROUTE.UserHandbookList}
            onClick={closeSidebar}
            className={cn(
              'group flex border-l-[3px] border-transparent gap-x-3 w-full p-2 text-sm leading-6 font-semibold transition-colors duration-150 ease-linear',
              {
                'border-primary bg-gradient-to-r from-muted-foreground/10 to-transparent dark:from-muted-foreground/20 animate-grow-right':
                  pathname.includes(APP_ROUTE.UserHandbookList),
              },
              {
                'hover:border-primary/30': !pathname.includes(APP_ROUTE.UserHandbookList),
              },
            )}
          >
            <BookOpenTextIcon className="h-6 w-6 shrink-0" />
            Handbook
          </NavLink>
        </div>
      )}
      <div className="-mx-2 mt-3">
        <Separator />
      </div>
      <nav className="overflow-y-auto no-scrollbar pt-4">
        <ul role="list">
          {navigationItems.map((item, idx) => {
            return (
              <div key={`${item.categoryName}-${idx}`} className="pb-6">
                <p className="font-bold pb-2">{item.categoryName}</p>
                {item.routes.map((item) => (
                  <li key={item.name} className="ml-1 relative">
                    <NavLink
                      onClick={closeSidebar}
                      to={item.to}
                      className={cn(
                        'group flex whitespace-nowrap border-l-[3px] border-transparent gap-x-3 w-full p-2 text-sm leading-6 font-semibold transition-all duration-200 ease-linear',
                        {
                          'border-primary bg-gradient-to-r from-muted-foreground/10 to-transparent dark:from-muted-foreground/20 animate-grow-right':
                            pathname.includes(item.to),
                        },
                        {
                          'hover:border-primary/40': !pathname.includes(item.to),
                        },
                      )}
                    >
                      <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                      {item.name}
                    </NavLink>
                  </li>
                ))}
              </div>
            );
          })}
        </ul>
      </nav>
      <MyProfileItemWithDropdown closeSidebar={closeSidebar} />
    </div>
  );
};
