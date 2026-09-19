'use client';

import { useCanvasStore } from '@/contexts/CanvasContext';

export default function Grid() {
  const camera = useCanvasStore((state) => state.camera);

  const GRID_SIZE = camera.zoom < 0.375 ? 320 : camera.zoom < 0.75 ? 160 : 80;

  const size = GRID_SIZE * camera.zoom;

  const offsetX = -camera.x * camera.zoom;
  const offsetY = -camera.y * camera.zoom;

  console.log(camera.zoom);

  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage: `
          linear-gradient(
            to right,
            rgba(128, 128, 128, 0.15) 1px,
            transparent 1px
          ),
          linear-gradient(
            to bottom,
            rgba(128, 128, 128, 0.15) 1px,
            transparent 1px
          )
        `,
        backgroundSize: `${size}px ${size}px`,
        backgroundPosition: `${offsetX}px ${offsetY}px`,
      }}
    />
  );
}
