'use client';

import ToolBar from '@/components/workspace/ToolBar';
import Workspace from '@/components/workspace/Workspace';

export default function Home() {
  return (
    <div>
      <ToolBar className="fixed z-50 bg-amber-300" />
      <Workspace />
    </div>
  );
}
