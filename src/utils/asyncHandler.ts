import { NextFunction, Request, RequestHandler, Response } from "express";

export default function asyncHandler(requestHandler: RequestHandler) {

  return (req: Request, res: Response, next: NextFunction) => {
    Promise
      .resolve(requestHandler(req, res, next))
      .catch(error => next(error))
  }
} 
