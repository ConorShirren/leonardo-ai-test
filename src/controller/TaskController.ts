import { Request, Response } from 'express';

import prisma from '../utils/db.config';

// * Fetch All Tasks
export const fetchTasks = async (req: Request, res: Response) => {
  const tasks = await prisma.task.findMany();
  return res.json({ status: 200, data: tasks });
};

// * Create Task
export const createTask = async (req: Request, res: Response) => {
  const { account_id, start_time, duration, schedule, type } = req.body;

  const newTask = await prisma.task.create({
    data: { start_time, duration, account_id, type, schedule },
  });

  return res.json({ status: 200, data: newTask, message: 'Task created.' });
};

// * Get task
export const getTask = async (req: Request, res: Response) => {
  const taskId = req.params.id;
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
    },
  });

  return res.json({ status: 200, data: task });
};

// * Update Task
export const updateTask = async (req: Request, res: Response) => {
  const taskId = req.params.id;
  const { account_id, start_time, duration, schedule, type } = req.body;

  const updatedTask = await prisma.task.update({
    where: {
      id: taskId,
    },
    data: {
      account_id,
      start_time,
      duration,
      schedule,
      type,
    },
  });

  return res.json({
    status: 200,
    data: updatedTask,
    message: 'Task updated successfully',
  });
};

// * Delete Task
export const deleteTask = async (req: Request, res: Response) => {
  const taskId = req.params.id;
  await prisma.task.delete({
    where: {
      id: taskId,
    },
  });

  return res.json({ status: 200, message: 'Task deleted successfully' });
};
