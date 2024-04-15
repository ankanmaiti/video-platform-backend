import { NextFunction, Request, RequestHandler, Response } from "express";
import { ApiError } from "./apiError";

export function asyncHandler(requestHandler: RequestHandler, clean: (() => void) | null = null) {

  return (req: Request, res: Response, next: NextFunction) => {
    Promise
      .resolve(requestHandler(req, res, next))
      .catch((error: ApiError) => {
        res.status(error.statusCode).json(
          {
            statusCode: error.statusCode,
            message: error.message,
            success: false,
            data: error.data
          }
        )
        next(error)
      })
      .finally(() => clean?.())
  }
}



// export default function asyncHandler(requestHandler: RequestHandler) {
//
//   return async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       await requestHandler(req, res, next)
//
//     } catch (error) {
//       res.status(error.code || 500).json({
//         success: false,
//         message: error.message
//       })
//     }
//
//   }
// }

