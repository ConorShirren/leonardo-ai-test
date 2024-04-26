import { Request, Response } from 'express';
import { Task, TaskType } from '../../types/task';
import {
  createTask,
  deleteTask,
  fetchTasks,
  getTask,
  updateTask,
} from '../TaskController';

import prisma from '../../utils/db.config';
import { scheduler } from 'timers/promises';

jest.mock('../../utils/db.config', () => ({
  task: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('Task Controller', () => {
  const mockedDate = new Date('2024-04-25T12:00:00Z');
  const task: Task = {
    account_id: 1,
    schedule_id: '1',
    start_time: mockedDate,
    duration: 1000,
    type: TaskType.BREAK,
  };
  beforeEach(() => {
    jest.spyOn(global, 'Date').mockImplementation(() => mockedDate);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('fetchTasks', () => {
    it('should fetch tasks from the database and return them', async () => {
      const tasks: Task[] = [task];

      (prisma.task.findMany as jest.Mock).mockResolvedValueOnce(tasks);

      const req = {} as Request;
      const res = {
        json: jest.fn(),
      } as unknown as Response;

      await fetchTasks(req, res);

      expect(prisma.task.findMany).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({
        status: 200,
        data: tasks,
      });
    });

    it('should return 500 status and error message when an error occurs', async () => {
      const mockError = new Error('Mock error');
      jest.spyOn(prisma.task, 'findMany').mockRejectedValueOnce(mockError);

      const req = {} as Request;
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response;

      await fetchTasks(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Internal Server Error: Failed to fetch tasks',
        error: mockError.message,
      });
    });
  });

  describe('createTask', () => {
    it('should create a new task and return it', async () => {
      (prisma.task.create as jest.Mock).mockResolvedValueOnce(task);

      const req = {
        body: task,
      } as unknown as Request;
      const res = {
        json: jest.fn(),
      } as unknown as Response;

      await createTask(req, res);

      expect(prisma.task.create).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({
        status: 200,
        data: task,
        message: 'Task created.',
      });
    });

    it('should return 500 status and error message when an error occurs', async () => {
      const mockError = new Error('Mock error');
      jest.spyOn(prisma.task, 'create').mockRejectedValueOnce(mockError);

      const req = { body: { id: '1' } } as Request;
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response;

      await createTask(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Internal Server Error: Failed to create task',
        error: mockError.message,
      });
    });
  });

  describe('getTask', () => {
    it('should fetch a single task from the database and return it', async () => {
      const taskId = '1';

      (prisma.task.findUnique as jest.Mock).mockResolvedValueOnce(task);

      const req = { params: { id: taskId } } as unknown as Request;
      const res = {
        json: jest.fn(),
      } as unknown as Response;

      await getTask(req, res);

      expect(prisma.task.findUnique).toHaveBeenCalledTimes(1);
      expect(prisma.task.findUnique).toHaveBeenCalledWith({
        where: { id: taskId },
        include: { schedule: true },
      });
      expect(res.json).toHaveBeenCalledWith({
        status: 200,
        data: task,
      });
    });

    it('should return 500 status and error message when an error occurs', async () => {
      const mockError = new Error('Mock error');
      jest.spyOn(prisma.task, 'findUnique').mockRejectedValueOnce(mockError);

      const req = { params: { id: '1' } } as unknown as Request;
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response;

      await getTask(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Internal Server Error: Failed to fetch task',
        error: mockError.message,
      });
    });
  });

  describe('updateTask', () => {
    it('should update an existing task and return success message', async () => {
      const taskId = '123e4567-e89b-12d3-a456-426614174000';
      const updatedTask = {
        account_id: 1,
        schedule_id: '123e4567-e89b-12d3-a456-426614174000P',
        start_time: mockedDate,
        duration: 1000,
        type: TaskType.BREAK,
      };
      const req = {
        params: { id: taskId },
        body: updatedTask,
      } as unknown as Request;
      const res = {
        json: jest.fn(),
      } as unknown as Response;

      await updateTask(req, res);

      expect(prisma.task.update).toHaveBeenCalledTimes(1);
      expect(prisma.task.update).toHaveBeenCalledWith({
        where: { id: taskId },
        data: updatedTask,
      });
      expect(res.json).toHaveBeenCalledWith({
        status: 200,
        message: 'Task updated successfully',
      });
    });

    it('should return 500 status and error message when an error occurs', async () => {
      const mockError = new Error('Mock error');
      jest.spyOn(prisma.task, 'update').mockRejectedValueOnce(mockError);

      const req = {
        body: { id: '1' },
        params: { id: '1' },
      } as unknown as Request;
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response;

      await updateTask(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Internal Server Error: Failed to update task',
        error: mockError.message,
      });
    });
  });

  describe('deleteTask', () => {
    it('should delete an existing task and return success message', async () => {
      const taskId = '123e4567-e89b-12d3-a456-426614174000';

      const req = { params: { id: taskId } } as unknown as Request;
      const res = {
        json: jest.fn(),
      } as unknown as Response;

      await deleteTask(req, res);

      expect(prisma.task.delete).toHaveBeenCalledTimes(1);
      expect(prisma.task.delete).toHaveBeenCalledWith({
        where: { id: taskId },
      });
      expect(res.json).toHaveBeenCalledWith({
        status: 200,
        message: 'Task deleted successfully',
      });
    });

    it('should return 500 status and error message when an error occurs', async () => {
      const mockError = new Error('Mock error');
      jest.spyOn(prisma.task, 'delete').mockRejectedValueOnce(mockError);

      const req = { params: { id: '1' } } as unknown as Request;
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as unknown as Response;

      await deleteTask(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Internal Server Error: Failed to delete task',
        error: mockError.message,
      });
    });
  });
});
