import 'dotenv/config'
import connectDB from "./db/index";
import app from './app';


connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log('app is unable to connect with DB : ', error)
      process.exit(1)
    })
    app.listen(process.env.PORT || 8000, () => {
      console.log('Server is running at port : ', process.env.PORT || 8000)
    })
  })
  .catch(err => console.error('mongodb connection failled : ', err))



