import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express()


app.use(cors({
  origin: process.env.CORS_ORIGIN as string,
  credentials: true,
}))

app.use(express.json({
  limit: "16kb",
}))

app.use(express.urlencoded({
  extended: true,
  limit: "8kb",
}))

app.use(express.static("public"))


// perform CRUD on browser cookie securely
app.use(cookieParser())


// routes import
import userRouter from './routes/user.routes' 

// routes declaration
app.use("/api/v1/users", userRouter)


export default app
