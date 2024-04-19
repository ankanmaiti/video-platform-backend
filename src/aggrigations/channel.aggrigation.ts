import { User } from "../models/user.model";


export const getChannelDetails = async (username: string, userId: string) => await User.aggregate([
  {
    $match: {
      username: username,
    }
  },
  {
    $lookup: {
      from: "Subscription",
      localField: "_id",
      foreignField: "channel",
      as: "subscribedTo"
    }
  },
  {
    $lookup: {
      from: "Subscription",
      localField: "_id",
      foreignField: "subscriber",
      as: "subscribers"
    }
  },
  {
    $addFields: {
      subscriberCount: {
        $size: "$subscribers"
      },
      subscribedToCount: {
        $size: "$subscribedTo"
      },
      isSubscribed: {
        $cond: {
          if: {
            $in: [userId, "$subscribers.subscriber"],
          },
          then: true,
          else: false
        }
      }
    }
  },
  {
    $project: {
      username: 1,
      fullname: 1,
      subscriberCount: 1,
      subscribedToCount: 1,
      isSubscribed: 1,
      avatar: 1,
      coverImage: 1
    }
  }
])
