import { User, UserType } from "../models/user.model";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, user }: { oldPassword: string; newPassword: string; user: UserType; } = req.body

  // validation
  if (!oldPassword || !newPassword) {
    throw new ApiError(409, "can't accept empty fields (oldPassword, newPassword)")
  }

  // get user & verify password
  const userData = await User.findById<UserType>(user._id, "password").exec()
  if (!userData) {
    throw new ApiError(500, "Something went wrong while fetching user")
  }

  const isPasswordCorrect = await userData?.isPasswordCorrect(oldPassword)

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password")
  }

  // update new password
  userData.password = newPassword
  const updatedUser = await userData.save({ validateBeforeSave: false })

  if (!updatedUser) {
    throw new ApiError(500, "Something went wrong while updating new password")
  }

  // response
  res.status(200)
    .json(new ApiResponse(200, {}, "password changes successfully"))
})

export {
  changePassword
}
