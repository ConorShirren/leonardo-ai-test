import { Schedule } from './schedule';
import { UUID } from 'crypto';

export type Task = {
  id: UUID;
  account_id: number;
  schedule_id?: string;
  start_time?: Date;
  duration: number;
  type: TaskType;
  schedule?: Schedule;
};

export enum TaskType {
  BREAK,
  WORK,
}
