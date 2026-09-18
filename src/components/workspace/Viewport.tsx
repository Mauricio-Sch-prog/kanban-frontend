import { useBoardContext } from '@/contexts/BoardContext';
import { useCardDisplayStore } from '@/contexts/CardDisplayContext';
import { useCanvas } from '@/hooks/workspace/useCanvas';
import { useDisableBrowserZoom } from '@/hooks/workspace/useDisableBrowserZoom';
import useSelect from '@/hooks/workspace/useSelect';
import { Board } from '@/types/board';

export default function Viewport({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { boards = [] as Board[] } = useBoardContext();

  const cards = useCardDisplayStore((state) => state.cards);
  
    const canvas = useCanvas(cards);
  const select = useSelect();
  useDisableBrowserZoom();

  return (
    <div
      onContextMenuCapture={(e) => {
        select.selectFromTarget(e.target);
      }}
      onPointerDown={(e) => {
        const isSelectable = select.selectElement(e);

        if (!isSelectable) {
          canvas.startPan(e);
        }
      }}
      onPointerMove={canvas.pan}
      onPointerUp={canvas.stopPan}
      onPointerCancel={canvas.stopPan}
      onWheel={canvas.zoomAt}
      {...props}
      className="bg-bg relative h-screen w-screen overflow-hidden"
    >
      {children}
    </div>
  );
}
