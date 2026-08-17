'use client';

import NavBar from '@/components/ui/NavBar';
import ToolBar from '@/components/workspace/ToolBar';
import Workspace from '@/components/workspace/Workspace';

export default function Home() {
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <Workspace />

      <NavBar className="bg-primary fixed inset-x-0 top-0 z-50 flex h-14 flex-row-reverse items-center px-4 shadow-2xl" />

      <ToolBar className="bg-primary fixed inset-y-0 left-0 z-50 mt-14 w-16 shadow-2xl" />
    </div>
  );
}
