'use client';

import { LogOut, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { useLogout } from '@/hooks/auth/useLogout';
import { useAccountInfo } from '@/hooks/auth/useAccountInfo';
import Image from 'next/image';

interface User {
  name: string;
  email: string;
  avatarUrl: string;
}

export default function UserProfile(user: User) {
  const logoutMutation = useLogout();

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

      <DropdownMenuContent align="end" sideOffset={8} className="w-64 p-2">
        <div className="flex items-center gap-3 px-2 py-2">
          {/* Avatar */}
          <div className="bg-muted h-10 w-10 shrink-0 overflow-hidden rounded-full">
            {user.avatarUrl ? (
              <Image
                width={40}
                height={40}
                src={user.avatarUrl}
                alt={user.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <User size={40} className="text-muted-foreground" />
            )}
          </div>

          {/* Name + email */}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{user?.name || 'User'}</p>

            <p className="text-muted-foreground truncate text-xs">{user?.email}</p>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="text-accent focus:text-accent cursor-pointer"
          onClick={() => {
            logoutMutation.mutate();
          }}
        >
          <LogOut size={16} />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
