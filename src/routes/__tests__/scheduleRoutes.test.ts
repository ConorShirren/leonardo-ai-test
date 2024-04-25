import {
  createSchedule,
  deleteSchedule,
  fetchSchedules,
  getSchedule,
  updateSchedule,
} from '../../controller/ScheduleController';
import express, { Request, Response } from 'express';

import { Schedule } from '../../types/schedule';
import request from 'supertest';
import router from '../../routes/scheduleRoutes';

const app = express();
app.use(express.json());
app.use('/', router);

jest.mock('../../controller/ScheduleController', () => ({
  fetchSchedules: jest.fn(),
  getSchedule: jest.fn(),
  createSchedule: jest.fn(),
  deleteSchedule: jest.fn(),
  updateSchedule: jest.fn(),
}));

describe('fetchSchedules', () => {
  const mockedDate = new Date('2024-04-25T12:00:00Z');

  beforeEach(() => {
    // Mock the Date constructor
    jest.spyOn(global, 'Date').mockImplementation(() => mockedDate);
  });

  afterEach(() => {
    // Restore the original implementation after each test
    jest.restoreAllMocks();
  });

  it('should call fetchSchedules controller function and return 200 status code with schedules', async () => {
    const schedules: Schedule[] = [
      {
        id: '123e4567-e89b-12d3-a456-426614174000',
        account_id: 1,
        // start_time: mockedDate,
        // end_time: mockedDate,
        agent_id: 1234,
        tasks: [],
      },
    ];

    (fetchSchedules as jest.Mock).mockImplementationOnce(
      (req: Request, res: Response) => {
        res.json({ status: 200, data: schedules });
      }
    );

    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(fetchSchedules).toHaveBeenCalledTimes(1);
    expect(response.body).toEqual({ status: 200, data: schedules });
  });
});

describe('getSchedule', () => {
  it('should call getSchedule controller function and return 200 status code with schedule', async () => {
    const schedule: Schedule = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      account_id: 1,
      // start_time: mockedDate,
      // end_time: mockedDate,
      agent_id: 1234,
      tasks: [],
    };

    (getSchedule as jest.Mock).mockImplementationOnce(
      (req: Request, res: Response) => {
        res.json({ status: 200, data: schedule });
      }
    );

    const response = await request(app).get(
      '/id=123e4567-e89b-12d3-a456-426614174000'
    );
    expect(response.status).toBe(200);
    expect(getSchedule).toHaveBeenCalledTimes(1);
    expect(response.body).toEqual({ status: 200, data: schedule });
  });
});

describe('createSchedule', () => {
  it('should call getSchedule controller function and return 200 status code with schedule', async () => {
    const schedule: Schedule = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      account_id: 1,
      // start_time: mockedDate,
      // end_time: mockedDate,
      agent_id: 1234,
      tasks: [],
    };

    (createSchedule as jest.Mock).mockImplementationOnce(
      (req: Request, res: Response) => {
        res.json({ status: 200, data: schedule, msg: 'Schedule created.' });
      }
    );

    const response = await request(app).post('/').send(schedule);
    expect(response.status).toBe(200);
    expect(createSchedule).toHaveBeenCalledTimes(1);
    expect(response.body).toEqual({
      status: 200,
      data: schedule,
      msg: 'Schedule created.',
    });
  });
});
describe('updateSchedule', () => {
  it('should call getSchedule controller function and return 200 status code with schedule', async () => {
    const schedule: Schedule = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      account_id: 1,
      // start_time: mockedDate,
      // end_time: mockedDate,
      agent_id: 1234,
      tasks: [],
    };

    (updateSchedule as jest.Mock).mockImplementationOnce(
      (req: Request, res: Response) => {
        res.json({ status: 200, message: 'Schedule updated successfully' });
      }
    );

    const response = await request(app)
      .put('/id=123e4567-e89b-12d3-a456-426614174000')
      .send(schedule);
    expect(response.status).toBe(200);
    expect(updateSchedule).toHaveBeenCalledTimes(1);
    expect(response.body).toEqual({
      status: 200,
      message: 'Schedule updated successfully',
    });
  });
});

describe('deleteSchedule', () => {
  it('should call getSchedule controller function and return 200 status code with schedule', async () => {
    (deleteSchedule as jest.Mock).mockImplementationOnce(
      (req: Request, res: Response) => {
        res.json({ status: 200, msg: 'Schedule deleted successfully' });
      }
    );

    const response = await request(app).delete(
      '/id=123e4567-e89b-12d3-a456-426614174000'
    );
    expect(response.status).toBe(200);
    expect(deleteSchedule).toHaveBeenCalledTimes(1);
    expect(response.body).toEqual({
      status: 200,
      msg: 'Schedule deleted successfully',
    });
  });
});
