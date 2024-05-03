import { useMemo, useState } from 'react';
import { NavLink, Navigate, Outlet, useLocation } from 'react-router-dom';
import { Transition } from '@headlessui/react';

import { useAuth } from '@/providers/GlobalProvider';
import { cn } from '@/helpers/utils';
import { APP_ROUTE, NAVIGATION_ITEMS } from '@/helpers/constants';
import { MyProfileItemWithDropdown } from '@/components/MyProfileItemWithDropdown';
import { DynamicMobileHamburger } from '@/components/DynamicMobileHamburger';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { BookOpenTextIcon } from 'lucide-react';

interface Props {
  children?: React.ReactNode;
}

export const PrivateLayout = ({ children = <Outlet /> }: Props) => {
  const { isLoggedIn, user, logoutUser } = useAuth();
  const { pathname } = useLocation();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);

  const navigationItemsFilteredByRole = useMemo(() => {
    return NAVIGATION_ITEMS.filter((navItem) => navItem.allowedRoles?.includes(user.role));
  }, [user]);

  const userInitials = `${user.firstName[0] ?? ''} ${user.lastName[0] ?? ''}`;

  if (!user.id || !isLoggedIn) {
    return <Navigate to={APP_ROUTE.SignIn} />;
  }

  return (
    <div className="min-h-[100svh]">
      <nav className="bg-primary">
        {/* DESKTOP NAVIGATION */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <NavLink to="/" className="flex-shrink-0">
                <img className="h-10 object-contain grayscale brightness-[20]" src="/ccd_logo.png" alt="CCD Logo" />
              </NavLink>
              <div className="hidden md:block">
                <div className="ml-4 lg:ml-8 flex items-center space-x-2 lg:space-x-4">
                  {navigationItemsFilteredByRole.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.to}
                      className={cn(
                        'flex gap-x-3 items-center rounded-md px-3 py-2 text-sm font-medium transition-colors text-white duration-150 ease-linear',
                        {
                          'bg-foreground/20 dark:bg-background/20 text-primary-foreground dark:text-white':
                            pathname.includes(item.to),
                        },
                        {
                          'hover:bg-secondary-foreground/5 dark:hover:bg-background/5': !pathname.includes(item.to),
                        },
                        {
                          'text-white/60 hover:bg-transparent dark:hover:bg-transparent pointer-events-none':
                            item.disabled,
                        },
                      )}
                    >
                      {item.icon && <item.icon className="h-5 w-5 shrink-0 " aria-hidden="true" />}
                      {item.name}
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>
            <div className="hidden md:flex">
              <NavLink
                to={APP_ROUTE.Handbooks}
                className={cn(
                  'flex gap-x-3 mr-2 items-center rounded-md px-3 py-2 text-sm font-medium transition-colors text-white duration-150 ease-linear',
                  {
                    'bg-foreground/20 dark:bg-background/20 text-primary-foreground dark:text-white': pathname.includes(
                      APP_ROUTE.Handbooks,
                    ),
                  },
                  {
                    'hover:bg-secondary-foreground/5 dark:hover:bg-background/5': !pathname.includes(
                      APP_ROUTE.Handbooks,
                    ),
                  },
                )}
              >
                <BookOpenTextIcon className="h-5 w-5 shrink-0 " aria-hidden="true" />
                <p className="hidden lg:block">Handbooks</p>
              </NavLink>
              <MyProfileItemWithDropdown />
            </div>
            <DynamicMobileHamburger isOpen={isMobileNavOpen} setIsOpen={setIsMobileNavOpen} />
          </div>
        </div>
        {/* MOBILE NAVIGATION */}
        <div className="md:hidden">
          <Transition appear={true} show={isMobileNavOpen} id="mobile-menu">
            <Transition.Child
              className="transition-all duration-300 overflow-hidden"
              enterFrom="transform scale-95 opacity-0 max-h-0"
              enterTo="transform scale-100 opacity-100 max-h-[410px]"
              leaveFrom="transform scale-100 opacity-100 max-h-[410px]"
              leaveTo="transform scale-95 opacity-0 max-h-0"
            >
              <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                {navigationItemsFilteredByRole.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.to}
                    onClick={() => setIsMobileNavOpen(false)}
                    className={cn(
                      'rounded-md px-3 py-2 text-base flex gap-x-3 items-center font-medium transition-colors text-white duration-150 ease-linear',
                      {
                        'bg-foreground/20 dark:bg-background/20 text-primary-foreground dark:text-white':
                          pathname.includes(item.to),
                      },
                      {
                        'hover:bg-secondary-foreground/5 dark:hover:bg-background/5': !pathname.includes(item.to),
                      },
                      {
                        'text-white/60 hover:bg-transparent dark:hover:bg-transparent pointer-events-none':
                          item.disabled,
                      },
                    )}
                  >
                    {item.icon && <item.icon className="h-6 w-6 shrink-0 " aria-hidden="true" />}
                    {item.name}
                  </NavLink>
                ))}
              </div>
              <div className="border-t border-white/20 pb-3 pt-4">
                <div className="flex items-center px-5">
                  <div className="flex-shrink-0">
                    <Avatar>
                      <AvatarImage src="profileimageurlgoeshere" />
                      <AvatarFallback className="bg-foreground/30 text-background -tracking-wider capitalize">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-white">{`${user.firstName ?? ''} ${user.lastName ?? ''}`}</div>
                    <div className="text-sm font-medium text-white/80">{user.email ?? ''}</div>
                  </div>
                  {/*  possible notification button would go here */}
                </div>
                <div className="mt-3 space-y-1 px-2">
                  <NavLink
                    to={APP_ROUTE.Handbooks}
                    className={cn(
                      'flex gap-x-3 mr-2 items-center rounded-md px-3 py-2 text-base font-medium transition-colors text-white duration-150 ease-linear',
                      {
                        'bg-foreground/20 dark:bg-background/20 text-primary-foreground dark:text-white':
                          pathname.includes(APP_ROUTE.Handbooks),
                      },
                      {
                        'hover:bg-secondary-foreground/5 dark:hover:bg-background/5': !pathname.includes(
                          APP_ROUTE.Handbooks,
                        ),
                      },
                    )}
                  >
                    Handbooks
                  </NavLink>
                  <NavLink
                    to={APP_ROUTE.MyProfile}
                    onClick={() => setIsMobileNavOpen(false)}
                    className={cn(
                      'rounded-md px-3 block py-2 text-base font-medium transition-colors text-white duration-150 ease-linear',
                      {
                        'bg-foreground/20 text-primary-foreground dark:text-white': pathname.includes(
                          APP_ROUTE.MyProfile,
                        ),
                      },
                      {
                        'hover:bg-secondary-foreground/5': !pathname.includes(APP_ROUTE.MyProfile),
                      },
                    )}
                  >
                    My Profile
                  </NavLink>
                  <button
                    type="button"
                    onClick={logoutUser}
                    className="rounded-md w-full text-start px-3 block py-2 text-base font-medium transition-colors text-white duration-150 ease-linear hover:bg-secondary-foreground/5"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </Transition.Child>
          </Transition>
        </div>
      </nav>
      <main>
        {/* <main className="relative flex flex-1 flex-col h-[100svh] sm:h-screen overflow-x-auto"> */}
        <div className="mx-auto max-w-7xl h-[calc(100svh-64px)]">{children}</div>
      </main>
    </div>
  );
};
