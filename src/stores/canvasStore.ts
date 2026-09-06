import { createStore } from 'zustand';

export interface Camera {
  x: number;
  y: number;
  zoom: number;
}

type CameraUpdater = Camera | ((prev: Camera) => Camera);

export interface CanvasState {
  camera: Camera;
  isDragging: boolean;

  setCamera: (camera: CameraUpdater) => void;
  setIsDragging: (value: boolean) => void;

  pan: (x: number, y: number) => void;
  setZoom: (zoom: number) => void;
}

export function createCanvasStore() {
  return createStore<CanvasState>((set) => ({
    camera: {
      x: 0,
      y: 0,
      zoom: 1,
    },

    isDragging: false,

    setCamera: (camera) => {
      set((state) => ({
        camera: typeof camera === 'function' ? camera(state.camera) : camera,
      }));
    },

    setIsDragging: (value) => {
      set({ isDragging: value });
    },

    pan: (x, y) => {
      set((state) => ({
        camera: {
          ...state.camera,
          x: state.camera.x + x,
          y: state.camera.y + y,
        },
      }));
    },

    setZoom: (zoom) => {
      set((state) => ({
        camera: {
          ...state.camera,
          zoom,
        },
      }));
    },
  }));
}
