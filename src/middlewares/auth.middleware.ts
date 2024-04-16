import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";
import { User } from "../models/user.model";

const verifyJwt = asyncHandler(async (req, _, next) => {
  // get accessToken
  const accessToken = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '')

  if (!accessToken) {
    throw new ApiError(401, "Unauthorized Request")
  }

  //Decode Token
  const decodedToken = jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET as string
  ) as jwt.JwtPayload

  // get user from decoded payload
  const user = await User.findById(decodedToken?._id).select(
    "-password -refreshToken"
  )

  if (!user) {
    throw new ApiError(404, "Invalid Access Token")
  }

  req.body.user = user
  next()
})

export {
  verifyJwt
}
