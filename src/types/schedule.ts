import { Task } from './task';
import { UUID } from 'crypto';

export type Schedule = {
  id: UUID;
  account_id: number;
  agent_id: number;
  start_time: Date;
  end_time: Date;
  tasks: Task[];
};
