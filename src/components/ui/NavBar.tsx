import ThemeToggle from './nav/ThemeToggle';
import UserProfile from './nav/UserProfile';
import { headers } from 'next/headers';

type DivProps = React.HTMLAttributes<HTMLDivElement>;

export default async function NavBar({ className = '', ...props }: DivProps) {
  const headersList = await headers();
  const userHeader = headersList.get('x-user-data');
  const user = userHeader ? JSON.parse(userHeader) : null;

  return (
    <div {...props} className={`flex flex-row-reverse items-center gap-2 ${className}`}>
      {user ? <UserProfile {...user} /> : null}
      <ThemeToggle />
    </div>
  );
}
