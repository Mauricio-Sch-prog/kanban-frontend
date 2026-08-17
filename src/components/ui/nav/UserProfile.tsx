'use client';

import { LogOut, Settings, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdownMenu';
import { useLogout } from '@/hooks/auth/useLogout';
import { useAccountInfo } from '@/hooks/auth/useAccountInfo';

export default function UserProfile() {
  const logoutMutation = useLogout();
  const { data: user = {}, isLoading, error } = useAccountInfo();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Open user menu"
          className="focus-visible:ring-accent flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:outline-none"
        >
          <User size={24} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="w-48">
        <DropdownMenuItem>
          {isLoading ? (
            <span>Loading...</span>
          ) : error ? (
            <span>{error.message || 'Error fetching data...'}</span>
          ) : (
            <span
            className='size-4'
            >{user?.email}</span>
          )}
        </DropdownMenuItem>

        {/* <DropdownMenuItem>
          <Settings size={16} />
          Settings
        </DropdownMenuItem> */}

        <DropdownMenuSeparator />

        <button
          onClick={() => {
            logoutMutation.mutate();
          }}
        >
          <DropdownMenuItem className="text-red-500 focus:text-red-500">
            <LogOut size={16} />
            Log out
          </DropdownMenuItem>
        </button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
