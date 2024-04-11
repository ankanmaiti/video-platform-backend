import { NextFunction, Request, RequestHandler, Response } from "express";

export default function asyncHandler(requestHandler: RequestHandler) {

  return (req: Request, res: Response, next: NextFunction) => {
    Promise
      .resolve(requestHandler(req, res, next))
      .catch(error => next(error))
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

