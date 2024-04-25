import { Router } from 'express';
import { fetchTasks } from '../controller/TaskController';

const router = Router();

router.get('/', fetchTasks);

export default router;
