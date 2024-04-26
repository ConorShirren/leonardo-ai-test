import {
  createSchedule,
  deleteSchedule,
  fetchSchedules,
  getSchedule,
  updateSchedule,
} from '../controller/ScheduleController';

import { Router } from 'express';
import { scheduleSchema } from '../schema/scheduleSchema';
import { validate } from '../middleware/validate';

const router = Router();

router.get('/', fetchSchedules);
router.get('/:id', getSchedule);
router.post('/', validate(scheduleSchema), createSchedule);
router.put('/:id', validate(scheduleSchema), updateSchedule);
router.delete('/:id', deleteSchedule);
export default router;
