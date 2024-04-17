import { ApiResponse } from "../utils/apiResponse"
import { asyncHandler } from "../utils/asyncHandler"

const getCurrentUser = asyncHandler(async (req, res) => {
  res.status(200)
    .json(new ApiResponse(200, req.body.user, "current user fetch successfully"))
})

export {
  getCurrentUser
}
