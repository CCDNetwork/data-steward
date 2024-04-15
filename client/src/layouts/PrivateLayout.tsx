import { useMemo, useState } from 'react';
import { NavLink, Navigate, Outlet, useLocation } from 'react-router-dom';
import { Transition } from '@headlessui/react';

import { useAuth } from '@/providers/GlobalProvider';
import { cn } from '@/helpers/utils';
import { APP_ROUTE, NAVIGATION_ITEMS } from '@/helpers/constants';
import { MyProfileItemWithDropdown } from '@/components/MyProfileItemWithDropdown';
import { DynamicMobileHamburger } from '@/components/DynamicMobileHamburger';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

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

  // return (
  //   <div className="relative flex overflow-hidden">
  //     <div className="flex w-fit md:w-[300px] z-10">
  //       <div className="flex max-w-[300px] h-full grow flex-col gap-y-5 overflow-y-auto bg-secondary dark:bg-secondary/10 border-r border-border px-6">
  //         <div className="flex mt-5 justify-center md:justify-start shrink-0 items-center">
  //           <Link to="/" className="flex">
  //             <img className="h-10 md:mb-1 w-auto" src="https://placehold.co/400" loading="lazy" alt="company-logo" />
  //             <span className="hidden md:block font-altone pl-2 text-[38px] leading-none align-text-bottom self-end">
  //               Application
  //             </span>
  //           </Link>
  //         </div>
  //         <nav className="flex flex-1 flex-col">
  //           <ul role="list" className="flex flex-1 flex-col gap-y-7">
  //             <li>
  //               <ul role="list" className="-mx-2 space-y-2 flex flex-col items-center md:block md:items-baseline">
  //                 {navigationItemsFilteredByRole.map((item) => (
  //                   <li key={item.name}>
  //                     <NavLink
  //                       to={item.to}
  //                       className={cn(
  //                         'group flex gap-x-3 w-fit md:w-full rounded-md p-2 text-sm leading-6 font-semibold transition-colors duration-150 ease-linear',
  //                         { 'bg-primary text-primary-foreground': pathname.includes(item.to) },
  //                         {
  //                           'text-secondary-foreground hover:bg-primary/10': !pathname.includes(item.to),
  //                         },
  //                       )}
  //                     >
  //                       <item.icon className="h-6 w-6 shrink-0 " aria-hidden="true" />
  //                       <p className="hidden md:block">{item.name}</p>
  //                       {item.count ? (
  //                         <span
  //                           className={cn(
  //                             'hidden md:block ml-auto w-9 min-w-max whitespace-nowrap rounded-full bg-primary px-2.5 py-0.5 text-center text-xs font-medium leading-5 text-primary-foreground',
  //                             { 'bg-secondary text-primary': pathname.includes(item.to) },
  //                           )}
  //                           aria-hidden="true"
  //                         >
  //                           {item.count}
  //                         </span>
  //                       ) : null}
  //                     </NavLink>
  //                   </li>
  //                 ))}
  //               </ul>
  //             </li>
  //             <MyProfileItemWithDropdown />
  //           </ul>
  //         </nav>
  //       </div>
  //     </div>

  //     <main className="relative flex flex-1 flex-col h-[100svh] sm:h-screen overflow-x-auto">{children}</main>
  //   </div>
  // );

  return (
    <div className="min-h-[100svh]">
      <nav className="bg-primary">
        {/* DESKTOP NAVIGATION */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img className="h-10 w-10 rounded-full" src="https://placehold.co/400" alt="CCD Logo" />
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  {navigationItemsFilteredByRole.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.to}
                      className={cn(
                        'rounded-md px-3 py-2 text-sm font-medium transition-colors text-white duration-150 ease-linear',
                        {
                          'bg-foreground/20 text-primary-foreground dark:text-white dark:bg-blue-600':
                            pathname.includes(item.to),
                        },
                        {
                          'hover:bg-secondary-foreground/5 hover:dark:bg-blue-600/40': !pathname.includes(item.to),
                        },
                      )}
                    >
                      {item.name}
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>
            <div className="hidden md:block">
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
                      'rounded-md px-3 py-2 text-base block font-medium transition-colors text-white duration-150 ease-linear',
                      {
                        'bg-foreground/20 text-primary-foreground dark:text-white dark:bg-blue-600': pathname.includes(
                          item.to,
                        ),
                      },
                      {
                        'hover:bg-secondary-foreground/5 hover:dark:bg-blue-600/40': !pathname.includes(item.to),
                      },
                    )}
                  >
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
                    to={APP_ROUTE.MyProfile}
                    onClick={() => setIsMobileNavOpen(false)}
                    className={cn(
                      'rounded-md px-3 block py-2 text-base font-medium transition-colors text-white duration-150 ease-linear',
                      {
                        'bg-foreground/20 text-primary-foreground dark:text-white dark:bg-blue-600': pathname.includes(
                          APP_ROUTE.MyProfile,
                        ),
                      },
                      {
                        'hover:bg-secondary-foreground/5 hover:dark:bg-blue-600/40': !pathname.includes(
                          APP_ROUTE.MyProfile,
                        ),
                      },
                    )}
                  >
                    Your Profile
                  </NavLink>
                  <button
                    type="button"
                    onClick={logoutUser}
                    className="rounded-md w-full text-start px-3 block py-2 text-base font-medium transition-colors text-white duration-150 ease-linear hover:bg-secondary-foreground/5 hover:dark:bg-blue-600/40"
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
