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

jest.mock('../../utils/db.config', () => ({
  task: {
    findMany: jest.fn(),
    create: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('Task Controller', () => {
  const mockedDate = new Date('2024-04-25T12:00:00Z');
  const task: Task = {
    id: '123e4567-e89b-12d3-a456-426614174000P',
    account_id: 1,
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
        msg: 'Task created.',
      });
    });
  });

  describe('getTask', () => {
    it('should fetch a single task from the database and return it', async () => {
      const taskId = '1';

      (prisma.task.findFirst as jest.Mock).mockResolvedValueOnce(task);

      const req = { params: { id: taskId } } as unknown as Request;
      const res = {
        json: jest.fn(),
      } as unknown as Response;

      await getTask(req, res);

      expect(prisma.task.findFirst).toHaveBeenCalledTimes(1);
      expect(prisma.task.findFirst).toHaveBeenCalledWith({
        where: { id: taskId },
      });
      expect(res.json).toHaveBeenCalledWith({
        status: 200,
        data: task,
      });
    });
  });

  describe('updateTask', () => {
    it('should update an existing task and return success message', async () => {
      const taskId = '123e4567-e89b-12d3-a456-426614174000';
      const req = {
        params: { id: taskId },
        body: task,
      } as unknown as Request;
      const res = {
        json: jest.fn(),
      } as unknown as Response;

      await updateTask(req, res);

      expect(prisma.task.update).toHaveBeenCalledTimes(1);
      expect(prisma.task.update).toHaveBeenCalledWith({
        where: { id: taskId },
        data: task,
      });
      expect(res.json).toHaveBeenCalledWith({
        status: 200,
        message: 'Task updated successfully',
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
        msg: 'Task deleted successfully',
      });
    });
  });
});