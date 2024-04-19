import { getChannelDetails } from "../aggrigations/channel.aggrigation";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params

  if (!username?.trim()) {
    throw new ApiError(400, "username is missing")
  }

  const channelDetails = await getChannelDetails(
    username.trim().toLowerCase(),
    req.body.user?._id,
  )

  if (!channelDetails?.length) {
    throw new ApiError(404, "Channel does not exists")
  }

  res.status(200)
    .json(new ApiResponse(200, channelDetails.at(0), "User channelDetails fetched successfully"))
})

export {
  getUserChannelProfile
};

