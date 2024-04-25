import express, { Request, Response } from 'express';

import { Schedule } from '../../types/schedule';
import { fetchSchedules } from '../../controller/ScheduleController';
import request from 'supertest';
import router from '../../routes/scheduleRoutes';

const app = express();
app.use(express.json());
app.use('/', router);

jest.mock('../../controller/ScheduleController', () => ({
  fetchSchedules: jest.fn(),
}));

describe('fetchTasks', () => {
  const mockedDate = new Date('2024-04-25T12:00:00Z');

  beforeEach(() => {
    // Mock the Date constructor
    jest.spyOn(global, 'Date').mockImplementation(() => mockedDate);
  });

  afterEach(() => {
    // Restore the original implementation after each test
    jest.restoreAllMocks();
  });

  it('should call fetchTasks controller function and return 200 status code with tasks', async () => {
    const schedules: Schedule[] = [
      {
        id: '123e4567-e89b-12d3-a456-426614174000',
        account_id: 1,
        agent_id: 12345,
        start_time: mockedDate,
        end_time: mockedDate,
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
