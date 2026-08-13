import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Kanban by Programador_Gaúcho',
  description: 'The perfect site to organize your task, goals and most creative ideas',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <div className="flex min-h-full flex-col">
      <nav>
        <Link href="/workspace">Workspace</Link>
      </nav>
      {children}
    </div>
  );
}
