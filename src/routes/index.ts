import { Router } from 'express';
import ScheduleRoutes from './scheduleRoutes';
import TaskRoutes from './taskRoutes';

const router = Router();

router.use('/api/schedule', ScheduleRoutes);
router.use('/api/task', TaskRoutes);

export default router;
