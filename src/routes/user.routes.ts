import { Router } from "express";
import { login } from "../controllers/login.controller";
import { signup } from "../controllers/signup.controller";
import { upload } from "../middlewares/multer.middlware";

const router = Router()

router
  .route("/register")
  .post(
    upload.fields([
      {
        name: 'avatar',
        maxCount: 1,
      },
      {
        name: "coverImage",
        maxCount: 1,
      }
    ]),
    signup
  )

router
  .route("/login")
  .post(login)

export default router

