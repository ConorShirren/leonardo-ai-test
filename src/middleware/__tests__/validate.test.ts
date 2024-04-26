import { Request, Response } from 'express';
import { ZodError, z } from 'zod';

import { validate } from '../validate';

describe('Validate', () => {
  it('should call next() if schema validation passes', () => {
    const schema = z.object({ name: z.string() });
    const req = { body: { name: 'John' } } as Request;
    const res = {} as Response;
    const next = jest.fn();

    validate(schema)(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should return 400 with ZodError if schema validation fails', () => {
    const schema = z.object({ name: z.string() });
    const req = { body: { age: 25 } } as Request;
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();

    validate(schema)(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: 'fail',
      errors: expect.any(Array),
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next with error if an unexpected error occurs', () => {
    const schema = z.object({ name: z.string() });
    const req = { body: { name: 'John' } } as Request;
    const res = {} as Response;
    const next = jest.fn((error) => {
      throw error;
    });

    expect(() => validate(schema)(req, res, next)).toThrowError();
  });
});
