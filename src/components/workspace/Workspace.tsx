import { CanvasProvider } from '@/contexts/CanvasContext';
import WorkspaceContent from './WorkspaceContent';
import { SelectProvider } from '@/contexts/SelectContext';

export default function Workspace() {
  return (
    <SelectProvider>
      <CanvasProvider>
        <WorkspaceContent />
      </CanvasProvider>
    </SelectProvider>
  );
}
