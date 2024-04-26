import { Schedule } from './schedule';

export type Task = {
  account_id: number;
  schedule_id: string;
  start_time: Date;
  duration: number;
  type: TaskType;
  schedule?: Schedule;
};

export enum TaskType {
  BREAK = 'BREAK',
  WORK = 'WORK',
}
