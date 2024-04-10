import 'dotenv/config'
import connectDB from "./db/index";


connectDB()


/**
import mongoose from "mongoose";
import { DB_NAME } from "./constants";
import express from 'express'


const app = express()

  ; (async function() {
    try {
      await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
      app.on("error", (error) => {
        console.log('app is unable to connect with DB : ', error)
        throw error
      })

      app.listen(process.env.PORT, () => {
        console.log('app is listening on port ', process.env.PORT)
      })

    } catch (error) {
      console.error('DB Connect error: ', error)
      throw error
    }
  })();
*/
