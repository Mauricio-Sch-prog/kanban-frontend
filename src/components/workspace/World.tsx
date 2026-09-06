import { useCanvasStore } from '@/contexts/CanvasContext';
import { ReactNode } from 'react';

interface WorldProps {
  children: ReactNode;
}

export default function World({ children }: WorldProps) {
  const camera = useCanvasStore((state) => state.camera);
  return (
    <div
      className="absolute top-0 left-0"
      style={{
        transformOrigin: '0 0',
        transform: `
          translate(
            ${-camera.x * camera.zoom}px,
            ${-camera.y * camera.zoom}px
          )
          scale(${camera.zoom})
        `,
      }}
    >
      {children}
    </div>
  );
}
