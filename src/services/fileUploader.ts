import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

/*
 * File Upload Stratagy:
 * 1. take the file input and temporarily store it in the server
 * 2. upload to cloudnary
 * 3. remove in the local server
*/

export async function mediaUpload(path: string) {
  if (!path) return

  try {
    // try to upload
    const res = await cloudinary.uploader.upload(path,
      {
        resource_type: "auto",
      }
    );

    // after upload successfully
    console.log('file is uploaded successfully on ', res.url)
    return res

  } catch (error) { }
  finally {
    // remove locally saved temp file
    fs.unlinkSync(path)
    return null
  }
}


