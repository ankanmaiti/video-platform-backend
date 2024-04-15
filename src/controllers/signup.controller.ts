
import { Request, Response } from "express"
import { User, UserType } from "../models/user.model"
import { mediaUpload } from "../services/fileUploader"
import { ApiError } from "../utils/apiError"
import { ApiResponse } from "../utils/apiResponse"
import { asyncHandler } from "../utils/asyncHandler"
import { cleanFiles } from "../utils/cleanTempFiles"

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
const signup = asyncHandler(async (req: Request, res: Response) => {
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
  const existedUser = await User.findOne<UserType>({
    $or: [{ username }, { email }]
  })

  if (!!existedUser) {
    throw new ApiError(409, 'user already exists')
  }

  // handle image (from multer)
  const files = req.files as { [fieldname: string]: Express.Multer.File[] }
  const avatarLocalPath = files?.avatar?.[0]?.path
  const coverImageLocalPath = files?.coverImage?.[0]?.path

  if (!avatarLocalPath) {
    throw new ApiError(400, 'avatar image required')
  }

  // upload image in cloudniary
  const avatar = await mediaUpload(avatarLocalPath)
  const coverImage = await mediaUpload(coverImageLocalPath)

  if (!avatar) {
    throw new ApiError(500, 'Something went wrong while uploading images')
  }

  // database entry
  const newUser = await User.create<UserType>({
    fullname,
    password,
    username: username.toLowerCase(),
    avatar: avatar.url,
    email: email.toLowerCase(),
    coverImage: coverImage?.url || '',
  })

  const createdUser = await User.findById<UserType>(newUser?._id).select(
    "-password -refreshToken"
  )

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while register a user")
  }

  // response
  return res.status(201).json(new ApiResponse(201, createdUser, "User register successfully"))
}, () => cleanFiles('./public/temp', ['.gitkeep']))



export {
  signup
}
