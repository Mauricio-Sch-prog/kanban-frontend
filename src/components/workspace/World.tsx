import { ReactNode } from 'react';

interface WorldProps {
  children: ReactNode;
  camera: {
    x: number;
    y: number;
    zoom: number;
  };
}

export default function World({ children, camera }: WorldProps) {
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
