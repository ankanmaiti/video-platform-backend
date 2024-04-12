import { randomUUID } from "crypto";
import multer from "multer";

/*
 * Multer save file to the server
 * this alow us to do oparation on file before putting it on the cloudniary or s3 bucket
*/


const storage = multer.diskStorage({
  destination: function(_req, _file, cb) {
    cb(null, "/public/temp")
  },
  filename: function(_req, file, cb) {
    const uniqueSuffix = randomUUID()
    cb(null, file.originalname + '-' + uniqueSuffix)
  }
})

export const upload = multer({
  storage: storage,
})
