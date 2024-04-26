import { Request, Response } from 'express';
import { Schedule, TaskType } from '.prisma/client';
import {
  createSchedule,
  deleteSchedule,
  fetchSchedules,
  getSchedule,
  updateSchedule,
} from '../ScheduleController';

import { Schedule as ScheduleType } from '../../types/schedule';
import prisma from '../../utils/db.config';

jest.mock('../../utils/db.config', () => ({
  schedule: {
    findMany: jest.fn(),
    create: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('Schedule Controller', () => {
  const mockedDate = new Date('2024-04-25T12:00:00Z');
  const schedule: ScheduleType = {
    id: '123e4567-e89b-12d3-a456-426614174000P',
    account_id: 1,
    start_time: mockedDate,
    end_time: mockedDate,
    agent_id: 1234,
    tasks: [],
  };
  beforeEach(() => {
    jest.spyOn(global, 'Date').mockImplementation(() => mockedDate);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('fetchSchedules', () => {
    it('should fetch schedules from the database and return them', async () => {
      const schedules: ScheduleType[] = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          account_id: 1,
          start_time: mockedDate,
          end_time: mockedDate,
          agent_id: 1234,
          tasks: [],
        },
      ];

      (prisma.schedule.findMany as jest.Mock).mockResolvedValueOnce(schedules);

      const req = {} as Request;
      const res = {
        json: jest.fn(),
      } as unknown as Response;

      await fetchSchedules(req, res);

      expect(prisma.schedule.findMany).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({
        status: 200,
        data: schedules,
      });
    });
  });

  describe('createSchedule', () => {
    it('should create a new schedule and return it', async () => {
      (prisma.schedule.create as jest.Mock).mockResolvedValueOnce(schedule);

      const req = {
        body: schedule,
      } as unknown as Request;
      const res = {
        json: jest.fn(),
      } as unknown as Response;

      await createSchedule(req, res);

      expect(prisma.schedule.create).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({
        status: 200,
        data: schedule,
        message: 'Schedule created.',
      });
    });
  });

  describe('getSchedule', () => {
    it('should fetch a single schedule from the database and return it', async () => {
      const scheduleId = '1';

      (prisma.schedule.findFirst as jest.Mock).mockResolvedValueOnce(schedule);

      const req = { params: { id: scheduleId } } as unknown as Request;
      const res = {
        json: jest.fn(),
      } as unknown as Response;

      await getSchedule(req, res);

      expect(prisma.schedule.findFirst).toHaveBeenCalledTimes(1);
      expect(prisma.schedule.findFirst).toHaveBeenCalledWith({
        where: { id: scheduleId },
      });
      expect(res.json).toHaveBeenCalledWith({
        status: 200,
        data: schedule,
      });
    });
  });

  describe('updateSchedule', () => {
    it('should update an existing schedule and return success message', async () => {
      const scheduleId = '123e4567-e89b-12d3-a456-426614174000';
      const req = {
        params: { id: scheduleId },
        body: schedule,
      } as unknown as Request;
      const res = {
        json: jest.fn(),
      } as unknown as Response;

      await updateSchedule(req, res);

      expect(prisma.schedule.update).toHaveBeenCalledTimes(1);
      expect(prisma.schedule.update).toHaveBeenCalledWith({
        where: { id: scheduleId },
        data: schedule,
      });
      expect(res.json).toHaveBeenCalledWith({
        status: 200,
        message: 'Schedule updated successfully',
      });
    });
  });

  describe('deleteSchedule', () => {
    it('should delete an existing schedule and return success message', async () => {
      const scheduleId = '123e4567-e89b-12d3-a456-426614174000';

      const req = { params: { id: scheduleId } } as unknown as Request;
      const res = {
        json: jest.fn(),
      } as unknown as Response;

      await deleteSchedule(req, res);

      expect(prisma.schedule.delete).toHaveBeenCalledTimes(1);
      expect(prisma.schedule.delete).toHaveBeenCalledWith({
        where: { id: scheduleId },
      });
      expect(res.json).toHaveBeenCalledWith({
        status: 200,
        message: 'Schedule deleted successfully',
      });
    });
  });
});
