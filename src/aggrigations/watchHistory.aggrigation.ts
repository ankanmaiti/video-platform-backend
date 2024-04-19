import mongoose from "mongoose";
import { User } from "../models/user.model";


export const watchHistory = async (userId: string,) => await User.aggregate([
  {
    $match: {
      _id: new mongoose.Types.ObjectId(userId)
    }
  },
  {
    $lookup: {
      from: "videos",
      localField: "watchHistory",
      foreignField: "_id",
      as: "watchHistory",
      pipeline: [
        {
          $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "owner",
            pipeline: [
              {
                $project: {
                  username: 1,
                  fullname: 1
                }
              }
            ]
          }
        },
        {
          $addFields: {
            owner: {
              $first: "$owner"
            }
          }
        }
      ]
    },
  },
])
