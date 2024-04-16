import { CookieOptions } from "express";
import { User } from "../models/user.model";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/apiResponse";
import { ApiError } from "../utils/apiError";

/*
 *- clear cookies in client (AccessToken & RefreshToken)
*/
const logout = asyncHandler(async (req, res) => {
  const userId = req.body.user?._id

  const user = User.findByIdAndUpdate(
    userId,
    {
      $set: {
        refreshToken: null
      }
    }
  )

  if (!user) {
    throw new ApiError(500, "Something went wrong while get user in log-out")
  }

  const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: true,
  }

  res.status(200)
    .clearCookie('accessToken', cookieOptions)
    .clearCookie('refreshToken', cookieOptions)
    .json(new ApiResponse(200, {}, "user logged out successfully"))
})

export {
  logout
}
