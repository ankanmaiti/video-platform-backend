import { Request, Response } from "express"
import asyncHandler from "../utils/asyncHandler"
import { ApiError } from "../utils/apiError"
import { ApiResponse } from "../utils/apiResponse"
import { User } from "../models/user.model"
import { mediaUpload } from "../services/fileUploader"

/* Steps to follow :
 * - get data
 * - validation
 * - check if user already exists
 * - multer check : for images, for avatar
 * - upload to cloudniary, avatar check
 * - create user object - create entry in db
 * - if successfull remove sensitive data from db response
 * - return response
*/
const registerUser = asyncHandler(async (req: Request, res: Response) => {
  // get data from body
  const {
    username,
    fullname,
    email,
    password,
  }: { username: string, fullname: string, email: string, password: string; } = req.body

  // basic validation
  if ([fullname, username, email, password].some((field: string) => !field?.trim())) {
    throw new ApiError(400, 'all fields are required')
  }

  // check for existed user
  const existedUser = await User.findOne({
    $or: [{ username }, { email }]
  })

  if (!!existedUser) {
    throw new ApiError(409, 'user already exists')
  }

  // handle image (from multer)
  const files = req.files as { [fieldname: string]: Express.Multer.File[] }
  if (!files) {
    throw new ApiError(400, 'please upload images')
  }

  const avatarLocalPath = files.avatar?.[0]?.path
  const coverImageLocalPath = files.coverImage?.[0]?.path

  if (!avatarLocalPath) {
    throw new ApiError(400, 'avatar image required')
  }

  // upload image in cloudniary
  const avatar = await mediaUpload(avatarLocalPath)
  const coverImage = await mediaUpload(coverImageLocalPath)

  if (!avatar) {
    throw new ApiError(400, 'avatar image required')
  }

  // database entry
  const newUser = await User.create({
    fullname,
    password,
    username: username.toLowerCase(),
    avatar: avatar.url,
    email: email.toLowerCase(),
    coverImage: coverImage?.url || '',
  })

  const createdUser = await User.findById(newUser?._id).select(
    "-password -refreshToken"
  )

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while register a user")
  }

  // response
  return res.status(201).json(new ApiResponse(201, createdUser, "User register successfully"))
})


export {
  registerUser
}
