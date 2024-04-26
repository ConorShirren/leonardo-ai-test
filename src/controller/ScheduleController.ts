import { Request, Response } from 'express';

import prisma from '../utils/db.config';

// * Fetch All Schedules
export const fetchSchedules = async (req: Request, res: Response) => {
  try {
    const schedules = await prisma.schedule.findMany();
    return res.json({ status: 200, data: schedules });
  } catch (err: any) {
    return res.status(500).json({
      status: 'error',
      message: 'Internal Server Error: Failed to fetch schedules',
      error: err.message,
    });
  }
};

// * Create Schedule
export const createSchedule = async (req: Request, res: Response) => {
  try {
    const { id, account_id, start_time, agent_id, end_time } = req.body;
    const newSchedule = await prisma.schedule.create({
      data: { id, start_time, account_id, agent_id, end_time },
    });

    return res.json({
      status: 200,
      data: newSchedule,
      message: 'Schedule created.',
    });
  } catch (err: any) {
    return res.status(500).json({
      status: 'error',
      message: 'Internal Server Error: Failed to create schedule',
      error: err.message,
    });
  }
};

// * Get schedule
export const getSchedule = async (req: Request, res: Response) => {
  try {
    const { id: scheduleId } = req.params;
    const schedule = await prisma.schedule.findUnique({
      where: {
        id: scheduleId,
      },
      include: {
        tasks: true,
      },
    });

    return res.json({ status: 200, data: schedule });
  } catch (err: any) {
    return res.status(500).json({
      status: 'error',
      message: 'Internal Server Error: Failed to get schedule',
      error: err.message,
    });
  }
};

// * Update Schedule
export const updateSchedule = async (req: Request, res: Response) => {
  try {
    const { id: scheduleId } = req.params;
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
  } catch (err: any) {
    return res.status(500).json({
      status: 'error',
      message: 'Internal Server Error: Failed to update schedule',
      error: err.message,
    });
  }
};

// * Delete Schedule
export const deleteSchedule = async (req: Request, res: Response) => {
  try {
    const { id: scheduleId } = req.params;
    await prisma.schedule.delete({
      where: {
        id: scheduleId,
      },
    });

    return res.json({ status: 200, message: 'Schedule deleted successfully' });
  } catch (err: any) {
    return res.status(500).json({
      status: 'error',
      message: 'Internal Server Error: Failed to delete schedule',
      error: err.message,
    });
  }
};
