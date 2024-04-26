import { TypeOf, z } from 'zod';

import { TaskType } from '../types/task';

export const taskSchema = z.object({
  schedule_id: z.string(),
  account_id: z.number(),
  duration: z.number(),
  start_time: z.string(z.date()),
  type: z.string(z.nativeEnum(TaskType)),
});
