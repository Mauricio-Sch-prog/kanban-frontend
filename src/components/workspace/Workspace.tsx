import { CanvasProvider } from '@/contexts/CanvasContext';
import WorkspaceContent from './WorkspaceContent';
import { SelectProvider } from '@/contexts/SelectContext';
import { BoardProvider } from '@/contexts/BoardContext';

export default function Workspace() {
  return (
    <BoardProvider>
      <SelectProvider>
        <CanvasProvider>
          <WorkspaceContent />
        </CanvasProvider>
      </SelectProvider>
    </BoardProvider>
  );
}
