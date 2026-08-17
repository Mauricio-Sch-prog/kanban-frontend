import { Task } from './task';

export type Lane = {
  id: string;
  name: string;
  index: number;
  tasks: Task[];
};
