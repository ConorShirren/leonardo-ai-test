import { AnyZodObject, ZodError } from 'zod';
import { NextFunction, Request, Response } from 'express';

export const validate =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);

      next();
    } catch (error: any) {
      console.dir(error.errors);
      if (error instanceof ZodError) {
        return res.status(400).json({
          status: 'fail',
          errors: error.errors,
        });
      }
      next(error);
    }
  };
