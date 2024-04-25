import { Task, TaskType } from '../../types/task';
import express, { Request, Response } from 'express';

import { fetchTasks } from '../../controller/TaskController';
import request from 'supertest';
import router from '../../routes/taskRoutes';

const app = express();
app.use(express.json());
app.use('/', router);

jest.mock('../../controller/TaskController', () => ({
  fetchTasks: jest.fn(),
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
    const tasks: Task[] = [
      {
        id: '123e4567-e89b-12d3-a456-426614174000',
        account_id: 1,
        schedule_id: 'abc123',
        // start_time: mockedDate,
        duration: 60,
        type: TaskType.WORK,
      },
    ];

    (fetchTasks as jest.Mock).mockImplementationOnce(
      (req: Request, res: Response) => {
        res.json({ status: 200, data: tasks });
      }
    );

    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(fetchTasks).toHaveBeenCalledTimes(1);
    expect(response.body).toEqual({ status: 200, data: tasks });
  });
});

describe('getTask', () => {
  it('should call getTask controller function and return 200 status code with task', async () => {
    const task: Task = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      account_id: 1,
      schedule_id: 'abc123',
      duration: 60,
      type: TaskType.WORK,
    };

    (fetchTasks as jest.Mock).mockImplementationOnce(
      (req: Request, res: Response) => {
        res.json({ status: 200, data: task });
      }
    );

    const response = await request(app).get(
      '/id=123e4567-e89b-12d3-a456-426614174000'
    );
    expect(response.status).toBe(200);
    expect(fetchTasks).toHaveBeenCalledTimes(1);
    expect(response.body).toEqual({ status: 200, data: task });
  });
});
