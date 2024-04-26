import {
  createTask,
  deleteTask,
  fetchTasks,
  getTask,
  updateTask,
} from '../controller/TaskController';

import { Router } from 'express';
import { taskSchema } from '../schema/taskSchema';
import { validate } from '../middleware/validate';

const router = Router();

router.get('/', fetchTasks);
router.get('/:id', getTask);
router.post('/', validate(taskSchema), createTask);
router.put('/:id', validate(taskSchema), updateTask);
router.delete('/:id', deleteTask);
export default router;
