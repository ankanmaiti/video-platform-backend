import { watchHistory } from "../aggrigations/watchHistory.aggrigation";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";


const getWatchHistory = async () => asyncHandler(async (req, res) => {
  const userId = req.body.user?._id

  const [history] = await watchHistory(userId)
  if (!history) {
    throw new ApiError(500, "Something went wrong while getting watch history")
  }
  
  res.status(200)
  .json(new ApiResponse(200, history.watchHistory, "history fetched successfully"))
})


export {
  getWatchHistory
}


