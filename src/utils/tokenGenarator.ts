import { User, UserType } from "../models/user.model";
import { ApiError } from "./apiError";

export async function generateAccessAndRefreshToken(userId: string) {
  try {

    const user = await User.findById<UserType>(userId)
    if (!user) {
      throw new ApiError(500, "Something went wrong while accesing user for generate refresh/access tokens")
    }

    //generate
    const refreshToken = user.generateRefreshToken()
    const accessToken = user.generateAccessToken()

    //save in database
    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    return {
      accessToken,
      refreshToken
    } as const

  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating refresh/access tokens")
  }
}
