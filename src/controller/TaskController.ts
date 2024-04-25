import { Request, Response } from 'express';

import prisma from '../utils/db.config';

export const fetchTasks = async (req: Request, res: Response) => {
  const tasks = await prisma.task.findMany();

  return res.json({ status: 200, data: tasks });
};
