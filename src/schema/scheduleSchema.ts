import { z } from 'zod';

export const scheduleSchema = z.object({
  account_id: z.number(),
  agent_id: z.number(),
  start_time: z.date(),
  end_time: z.date(),
});
