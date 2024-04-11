import { Schema, model } from "mongoose";
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'

const videoSchema = new Schema(
  {
    videoFile: {
      type: String, // cloudniary url
      required: [true, "Url of the Video is required"],
    },
    thumbnail: {
      type: String, // cloudniary url
      required: [true, "Url of the Thumbnail is required"],
    },
    title: {
      type: String, // cloudniary url
      required: [true, "Title is required"],
    },
    description: {
      type: String, // cloudniary url
    },
    duration: {
      type: Number,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
  },
  {
    timestamps: true,
  }
)

videoSchema.plugin(mongooseAggregatePaginate)
export const Video = model('Video', videoSchema)
