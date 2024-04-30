import { useNavigate } from 'react-router-dom';
import { LaptopIcon, LogOut, Moon, Sun, User } from 'lucide-react';

import { APP_ROUTE } from '@/helpers/constants';
import { useAuth } from '@/providers/GlobalProvider';
import { useTheme } from '@/providers/ThemeProvider';
import { Tooltip } from '@/components/Tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const MyProfileItemWithDropdown = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const { setTheme } = useTheme();

  const userInitials = `${user.firstName[0] ?? ''} ${user.lastName[0] ?? ''}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <div className="flex justify-center items-center cursor-default text-sm font-semibold leading-6">
          <Tooltip tooltipContent="My profile">
            <Avatar>
              <AvatarImage src="profileimageurlgoeshere" />
              <AvatarFallback className="bg-foreground/30 text-background -tracking-wider capitalize">
                {userInitials}
              </AvatarFallback>
            </Avatar>
          </Tooltip>
          <span className="sr-only">My profile</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-fit mx-2 my-1">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate(APP_ROUTE.MyProfile)}>
            <User className="mr-2 h-[1.2rem] w-[1.2rem]" />
            My Profile
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 mr-2" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 mr-2" />
            Theme
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => setTheme('light')}>
                <Sun className="mr-2 w-4 h-4" /> Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>
                <Moon className="mr-2 w-4 h-4" />
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')}>
                <LaptopIcon className="mr-2 h-4 w-4" />
                System
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-500 focus:text-red-500" onClick={logoutUser}>
          <LogOut className="mr-2 h-[1.2rem] w-[1.2rem]" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
