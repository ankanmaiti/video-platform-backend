import multer from "multer";

/*
 * Multer save file to the server
 * this alow us to do oparation on file before putting it on the cloudniary or s3 bucket
*/


const storage = multer.diskStorage({
  destination: function(_req, _file, cb) {
    cb(null, "./public/temp")
  },

  filename: function(_req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) 
    const [filename, type] = file.originalname.split('.')
    cb(null, filename + '-' + uniqueSuffix + '.' + type)
  }
})

export const upload = multer({
  storage,
})
