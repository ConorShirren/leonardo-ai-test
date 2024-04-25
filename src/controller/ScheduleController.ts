import { Request, Response } from 'express';

import prisma from '../utils/db.config';

export const fetchSchedules = async (req: Request, res: Response) => {
  const schedules = await prisma.schedule.findMany();

  return res.json({
    status: 200,
    data: schedules,
  });
};
