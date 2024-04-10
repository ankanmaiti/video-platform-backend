import mongoose from "mongoose";
import { DB_NAME } from "../constants";


export default async function connectDB() {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
    console.log(`mongodb connected !! DB HOST: ${connectionInstance.connection.host}`)
  } catch (error) {
    console.log('mongoDB connection error : ', error)
    process.exit(1)
  }
}
