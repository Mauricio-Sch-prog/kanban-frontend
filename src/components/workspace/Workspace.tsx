import { CanvasProvider } from '@/contexts/CanvasContext';
import WorkspaceContent from './WorkspaceContent';
import { SelectProvider } from '@/contexts/SelectContext';
import { BoardProvider } from '@/contexts/BoardContext';
import { CardDisplayProvider } from '@/contexts/CardDisplayContext';

export default function Workspace() {
  return (
    <BoardProvider>
      <SelectProvider>
        <CanvasProvider>
          <CardDisplayProvider>
            <WorkspaceContent />
          </CardDisplayProvider>
        </CanvasProvider>
      </SelectProvider>
    </BoardProvider>
  );
}
