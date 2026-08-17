'use client';

import ThemeToggle from './nav/ThemeToggle';
import UserProfile from './nav/UserProfile';

type DivProps = React.HTMLAttributes<HTMLDivElement>;

export default function NavBar({ className = '', ...props }: DivProps) {
  return (
    <div {...props} className={`flex flex-row-reverse items-center ${className}`}>
      <UserProfile />
      <ThemeToggle />
    </div>
  );
}
