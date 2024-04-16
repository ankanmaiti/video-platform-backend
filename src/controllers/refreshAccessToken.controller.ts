import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";
import { User, UserType } from "../models/user.model";
import { CookieOptions } from "express";
import { ApiResponse } from "../utils/apiResponse";

/*
 * Steps:
 * 1. get refreshToken and verify against secret key
 * 2. decode to get userId
 * 3. get user from DB
 * 4. verify refreshToken from DB with req.body.refreshToken
 * 5. if verified then create a accessToken
 * 6. send the accessToken with secure cookies
*/
const refreshAccessToken = asyncHandler(async (req, res) => {
  // get token
  const refreshToken = req.cookies?.refreshToken || req.header("refreshToken")?.replace("Bearer ", '')


  if (!refreshToken) {
    throw new ApiError(401, "Unauthorized request")
  }

  // verify as decode token agains secret key
  const decodedToken = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET as string
  ) as jwt.JwtPayload

  if (!decodedToken) {
    throw new ApiError(401, "Invalid Refresh Token")
  }

  // get user by decoded token
  const user = await User.findById<UserType>(
    decodedToken._id,
    "username email fullname refreshToken"
  ).exec()
  if (!user) {
    throw new ApiError(500, "Something went wrong while fetching user details")
  }

  if (!user.matchRefreshToken(refreshToken)) {
    throw new ApiError(404, "Unauthorized Request")
  }

  const accessToken = user.generateAccessToken()
  if (!accessToken) {
    throw new ApiError(500, "Something went wrong while generating access token")
  }

  // secure cookies
  const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: true
  }

  res.status(200)
    .cookie('accessToken', accessToken, cookieOptions)
    .json(new ApiResponse(200, { user, accessToken }, "Successfully refresh accessToken"))
})


export {
  refreshAccessToken
}
