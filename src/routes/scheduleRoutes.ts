import { Router } from 'express';
import { fetchSchedules } from '../controller/ScheduleController';

const router = Router();

router.get('/', fetchSchedules);

export default router;
