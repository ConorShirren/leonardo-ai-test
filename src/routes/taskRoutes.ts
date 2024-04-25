import {
  createTask,
  deleteTask,
  fetchTasks,
  getTask,
  updateTask,
} from '../controller/TaskController';

import { Router } from 'express';

const router = Router();

router.get('/', fetchTasks);
router.get('/:id', getTask);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
export default router;
