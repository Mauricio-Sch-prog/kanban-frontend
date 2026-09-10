import { Lane } from './lane';

export type Board = {
  id: string;
  name: string;
  positionX: number;
  positionY: number;
  width: number;
  lanes: Lane[];
  updatedAt: Date;
};
