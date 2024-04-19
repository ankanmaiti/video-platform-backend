import { Router } from "express";
import { login } from "../controllers/login.controller";
import { signup } from "../controllers/signup.controller";
import { upload } from "../middlewares/multer.middlware";
import { verifyJwt } from "../middlewares/auth.middleware";
import { logout } from "../controllers/logout.controller";
import { refreshAccessToken } from "../controllers/refreshAccessToken.controller";
import { getCurrentUser } from "../controllers/currentUser.controller";
import { changePassword } from "../controllers/password.controller";
import { getWatchHistory } from "../controllers/watchHistory.controller";

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

// secured routes
router
  .route("/logout")
  .post(verifyJwt, logout)

router
  .route('/details')
  .get(verifyJwt, getCurrentUser)

router
  .route('/watch-history')
  .get(verifyJwt, getWatchHistory)


router
  .route('/change-password')
  .post(verifyJwt, changePassword)


router
  .route('/refresh-token')
  .post(refreshAccessToken)

export default router

