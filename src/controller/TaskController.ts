import { Request, Response } from 'express';

import prisma from '../utils/db.config';

// * Fetch All Tasks
export const fetchTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await prisma.task.findMany();
    return res.json({ status: 200, data: tasks });
  } catch (err: any) {
    return res.status(500).json({
      status: 'error',
      message: 'Internal Server Error: Failed to fetch tasks',
      error: err.message,
    });
  }
};

// * Create Task
export const createTask = async (req: Request, res: Response) => {
  try {
    const { account_id, start_time, duration, type, schedule_id } = req.body;
    const newTask = await prisma.task.create({
      data: { start_time, duration, account_id, type, schedule_id },
    });

    return res.json({ status: 200, data: newTask, message: 'Task created.' });
  } catch (err: any) {
    return res.status(500).json({
      status: 'error',
      message: 'Internal Server Error: Failed to create task',
      error: err.message,
    });
  }
};

// * Get task
export const getTask = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.id;
    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
      include: {
        schedule: true,
      },
    });

    return res.json({ status: 200, data: task });
  } catch (err: any) {
    return res.status(500).json({
      status: 'error',
      message: 'Internal Server Error: Failed to fetch task',
      error: err.message,
    });
  }
};

// * Update Task
export const updateTask = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.id;
    const { account_id, start_time, duration, schedule_id, type } = req.body;
    const updatedTask = await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        account_id,
        start_time,
        duration,
        schedule_id,
        type,
      },
    });

    return res.json({
      status: 200,
      data: updatedTask,
      message: 'Task updated successfully',
    });
  } catch (err: any) {
    return res.status(500).json({
      status: 'error',
      message: 'Internal Server Error: Failed to update task',
      error: err.message,
    });
  }
};

// * Delete Task
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.id;
    await prisma.task.delete({
      where: {
        id: taskId,
      },
    });

    return res.json({ status: 200, message: 'Task deleted successfully' });
  } catch (err: any) {
    return res.status(500).json({
      status: 'error',
      message: 'Internal Server Error: Failed to delete task',
      error: err.message,
    });
  }
};
