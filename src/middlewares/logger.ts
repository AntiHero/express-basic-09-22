import type { Request, Response, NextFunction } from 'express';

export const requestLogger = (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  console.log(req.url, ' ', req.method);
  console.log('-------------------');
  next();
};
