import { BookOpenTextIcon, LayoutDashboardIcon } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';

import { LabelWithLoading } from '@/components/LabelWithLoading.tsx';
import { MyProfileItemWithDropdown } from '@/components/MyProfileItemWithDropdown';
import { Separator } from '@/components/ui/separator';
import { APP_ROUTE } from '@/helpers/constants';
import { NavigationItem } from '@/helpers/types';
import { cn } from '@/helpers/utils';

export const SidebarContent = ({
  navigationItems,
  showHandbookRoute,
  isCmsDataLoading,
  closeSidebar,
  handbookRouteName,
  dashboardRouteName,
}: {
  navigationItems: NavigationItem[];
  showHandbookRoute: boolean;
  isCmsDataLoading: boolean;
  handbookRouteName: string;
  dashboardRouteName: string;
  closeSidebar?: () => void;
}) => {
  const { pathname } = useLocation();

  return (
    <div className="flex dark:bg-muted/50 h-full grow flex-col overflow-hidden bg-primary/5 border-r border-border px-6">
      <div className="flex mt-4 -ml-1 shrink-0 items-center">
        <NavLink to="/" onClick={closeSidebar} className="flex-shrink-0">
          <img
            className="h-10 mt-2 object-contain block dark:hidden"
            src={'/hotpot-white.png'}
            alt="CCD Logo"
          />
          <img
            className="h-10 mt-2 object-contain hidden dark:block"
            src={'/hotpot-dark.png'}
            alt="CCD Logo"
          />
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
                'border-primary bg-gradient-to-r from-primary/10 to-transparent dark:from-primary/20 animate-grow-right':
                  pathname.includes(APP_ROUTE.UserHandbookList),
              },
              {
                'hover:border-primary/30': !pathname.includes(
                  APP_ROUTE.UserHandbookList
                ),
              }
            )}
          >
            <BookOpenTextIcon className="h-6 w-6 shrink-0" />

            <LabelWithLoading
              label={handbookRouteName}
              isLoading={isCmsDataLoading}
              skeletonClassName="w-full h-6"
            />
          </NavLink>
        </div>
      )}
      <div className={cn('-mx-2', { 'mt-3': !showHandbookRoute })}>
        <NavLink
          to={APP_ROUTE.Dashboard}
          onClick={closeSidebar}
          className={cn(
            'group flex border-l-[3px] border-transparent gap-x-3 w-full p-2 text-sm leading-6 font-semibold transition-colors duration-150 ease-linear',
            {
              'border-primary bg-gradient-to-r from-primary/10 to-transparent dark:from-primary/20 animate-grow-right':
                pathname.includes(APP_ROUTE.Dashboard),
            },
            {
              'hover:border-primary/30': !pathname.includes(
                APP_ROUTE.Dashboard
              ),
            }
          )}
        >
          <LayoutDashboardIcon className="h-6 w-6 shrink-0" />
          <LabelWithLoading
            label={dashboardRouteName}
            isLoading={isCmsDataLoading}
            skeletonClassName="w-full h-6"
          />
        </NavLink>
      </div>
      <div className="-mx-2 mt-3">
        <Separator />
      </div>
      <nav className="overflow-y-auto no-scrollbar pt-4">
        <ul role="list">
          {navigationItems?.map((item, idx) => {
            return (
              <div key={`${item.categoryName}-${idx}`} className="pb-3">
                <LabelWithLoading
                  label={<p className="font-bold pb-2">{item.categoryName}</p>}
                  isLoading={isCmsDataLoading}
                  skeletonClassName="w-full h-8 mb-2"
                />
                {item.routes.map((item, idx) => (
                  <li key={`${item.name}-${idx}`} className="ml-1 relative">
                    <NavLink
                      onClick={closeSidebar}
                      to={item.to}
                      className={cn(
                        'group flex whitespace-nowrap border-l-[3px] border-transparent gap-x-3 w-full p-2 text-sm leading-6 font-semibold transition-all duration-200 ease-linear',
                        {
                          'border-primary bg-gradient-to-r from-primary/10 to-transparent dark:from-primary/20 animate-grow-right':
                            pathname.includes(item.to),
                        },
                        {
                          'hover:border-primary/40': !pathname.includes(
                            item.to
                          ),
                        }
                      )}
                    >
                      <item.icon
                        className="h-6 w-6 shrink-0"
                        aria-hidden="true"
                      />
                      <LabelWithLoading
                        label={item.name}
                        isLoading={isCmsDataLoading}
                        skeletonClassName="w-full h-6"
                      />
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
