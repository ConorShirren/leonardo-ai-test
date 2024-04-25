import {
  createSchedule,
  deleteSchedule,
  fetchSchedules,
  getSchedule,
  updateSchedule,
} from '../controller/ScheduleController';

import { Router } from 'express';

const router = Router();

router.get('/', fetchSchedules);
router.get('/:id', getSchedule);
router.post('/', createSchedule);
router.put('/:id', updateSchedule);
router.delete('/:id', deleteSchedule);
export default router;
