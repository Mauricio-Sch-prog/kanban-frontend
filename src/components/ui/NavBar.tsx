'use client';

import UserProfile from './nav/UserProfile';

type DivProps = React.HTMLAttributes<HTMLDivElement>;

export default function NavBar(props: DivProps) {
  return (
    <div {...props}>
      <UserProfile></UserProfile>
    </div>
  );
}
