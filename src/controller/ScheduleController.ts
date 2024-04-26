import { Request, Response } from 'express';

import prisma from '../utils/db.config';

// * Fetch All Schedules
export const fetchSchedules = async (req: Request, res: Response) => {
  const schedules = await prisma.schedule.findMany();
  return res.json({ status: 200, data: schedules });
};

// * Create Schedule
export const createSchedule = async (req: Request, res: Response) => {
  const { id, account_id, start_time, agent_id, end_time } = req.body;

  const newSchedule = await prisma.schedule.create({
    data: { id, start_time, account_id, agent_id, end_time },
  });

  return res.json({
    status: 200,
    data: newSchedule,
    message: 'Schedule created.',
  });
};

// * Get schedule
export const getSchedule = async (req: Request, res: Response) => {
  const scheduleId = req.params.id;
  const schedule = await prisma.schedule.findUnique({
    where: {
      id: scheduleId,
    },
    include: {
      tasks: true,
    },
  });

  return res.json({ status: 200, data: schedule });
};

// * Update Schedule
export const updateSchedule = async (req: Request, res: Response) => {
  const scheduleId = req.params.id;
  const { account_id, agent_id, start_time, end_time } = req.body;

  const updateSchedule = await prisma.schedule.update({
    where: {
      id: scheduleId,
    },
    data: { start_time, agent_id, account_id, end_time },
  });

  return res.json({
    status: 200,
    data: updateSchedule,
    message: 'Schedule updated successfully',
  });
};

// * Delete Schedule
export const deleteSchedule = async (req: Request, res: Response) => {
  const scheduleId = req.params.id;
  await prisma.schedule.delete({
    where: {
      id: scheduleId,
    },
  });

  return res.json({ status: 200, message: 'Schedule deleted successfully' });
};
