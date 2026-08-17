import { Lane } from './lane';

export type Board = {
  id: string;
  name: string;
  positionX: number;
  positionY: number;
  height: number;
  width: number;
  lanes: Lane[];
};
