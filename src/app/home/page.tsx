'use client';

import NavBar from '@/components/ui/NavBar';
import ToolBar from '@/components/workspace/ToolBar';
import Workspace from '@/components/workspace/Workspace';

export default function Home() {
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <Workspace />

      {/* Overlays */}
      <NavBar className="bg-primary fixed inset-x-0 top-0 z-50 h-12.5 justify-end shadow-2xl" />

      <ToolBar className="bg-primary fixed inset-y-0 left-0 z-50 mt-12.5 w-16 shadow-2xl" />
    </div>
  );
}
