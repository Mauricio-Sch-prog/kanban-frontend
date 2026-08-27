import { getContentBounds } from '@/lib/utils';
import { Board } from '@/types/board';
import { useEffect, useRef, useState } from 'react';

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 4;

interface Camera {
  x: number;
  y: number;
  zoom: number;
}

export function useCanvas(boards: Board[]) {
  const [isDragging, setIsDragging] = useState(false);
  const [camera, setCamera] = useState<Camera>({
    x: 0,
    y: 0,
    zoom: 1,
  });

  const CONTENT_PADDING = 500;

  const bounds = getContentBounds(boards);

  const minX = bounds.minX - CONTENT_PADDING;
  const minY = bounds.minY - CONTENT_PADDING;

  const maxX = bounds.maxX + CONTENT_PADDING;
  const maxY = bounds.maxY + CONTENT_PADDING;

  const clampCamera = (camera: Camera): Camera => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const visibleWidth = viewportWidth / camera.zoom;
    const visibleHeight = viewportHeight / camera.zoom;

    const minCameraX = minX;
    const maxCameraX = maxX - visibleWidth;

    const minCameraY = minY;
    const maxCameraY = maxY - visibleHeight;

    return {
      ...camera,

      x:
        minCameraX > maxCameraX
          ? (minX + maxX - visibleWidth) / 2
          : Math.min(Math.max(camera.x, minCameraX), maxCameraX),

      y:
        minCameraY > maxCameraY
          ? (minY + maxY - visibleHeight) / 2
          : Math.min(Math.max(camera.y, minCameraY), maxCameraY),
    };
  };

  const [isPanning, setIsPanning] = useState(false);

  const lastPointer = useRef({
    x: 0,
    y: 0,
  });

  const clamp = (value: number, min: number, max: number) => {
    return Math.min(Math.max(value, min), max);
  };

  const screenToWorld = (screenX: number, screenY: number, camera: Camera) => {
    return {
      x: screenX / camera.zoom + camera.x,
      y: screenY / camera.zoom + camera.y,
    };
  };

  const worldToScreen = (worldX: number, worldY: number, camera: Camera) => {
    return {
      x: (worldX - camera.x) * camera.zoom,
      y: (worldY - camera.y) * camera.zoom,
    };
  };

  const startPan = (e: React.MouseEvent) => {
    setIsPanning(true);

    lastPointer.current = {
      x: e.clientX,
      y: e.clientY,
    };
  };

  const pan = (e: React.MouseEvent) => {
    if (e.button === 2) return;
    if (!isPanning) return;

    const dx = e.clientX - lastPointer.current.x;
    const dy = e.clientY - lastPointer.current.y;

    setCamera((prev) => {
      const nextCamera = {
        ...prev,
        x: prev.x - dx / prev.zoom,
        y: prev.y - dy / prev.zoom,
      };

      return clampCamera(nextCamera);
    });

    lastPointer.current = {
      x: e.clientX,
      y: e.clientY,
    };
  };

  const stopPan = () => {
    setIsPanning(false);
  };

  useEffect(() => {
    if (!isPanning) return;

    const handleMouseUp = () => {
      setIsPanning(false);
    };

    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isPanning]);

  const zoomAt = (e: React.WheelEvent) => {
    if (isDragging) return;

    setCamera((prev) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      const worldPoint = screenToWorld(mouseX, mouseY, prev);

      const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;

      const newZoom = clamp(prev.zoom * zoomFactor, MIN_ZOOM, MAX_ZOOM);

      const nextCamera = {
        zoom: newZoom,

        x: worldPoint.x - mouseX / newZoom,

        y: worldPoint.y - mouseY / newZoom,
      };

      return clampCamera(nextCamera);
    });
  };

  return {
    camera,
    isPanning,
    isDragging,

    startPan,
    pan,
    stopPan,
    zoomAt,

    setIsDragging,

    screenToWorld,
    worldToScreen,
  };
}
