
import { CookieOptions } from "express"
import { User, UserType } from "../models/user.model"
import { ApiError } from "../utils/apiError"
import { ApiResponse } from "../utils/apiResponse"
import { asyncHandler } from "../utils/asyncHandler"
import { generateAccessAndRefreshToken } from "../utils/tokenGenarator"


/*
 * steps:
 * 1. get username/email with password
 * 2. validation
 * 3. find the user by username/email
 * 4. check password
 * 5. generate Access & Refresh Tokens
 * 6. send tokens with secure cookies
*/
const login = asyncHandler(async (req, res) => {
  const { username, email, password }: { username: string, email: string, password: string } = req.body

  // validation
  if (!username && !email) {
    throw new ApiError(409, "username or email is required")
  }

  if (!password) {
    throw new ApiError(409, "password is required")
  }

  // find user
  const user = await User.findOne<UserType>(
    {
      $or: [{ username }, { email }]
    }
  )

  if (!user) {
    throw new ApiError(409, "user does not exist")
  }

  // check password
  const isValidPassword = await user.isPasswordCorrect(password)
  if (!isValidPassword) {
    throw new ApiError(409, "Invalid Credentials")
  }

  //generate tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

  // setup secure cookies
  const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: true,
  }

  // send response
  res.status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(new ApiResponse(
      200,
      {
        user: loggedInUser,
      }
    ))
})


export {
  login
}

