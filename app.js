import express from "express"
import morgan from "morgan"
import config from "./config/config.js"
import dbConnection from "./Database/dbconnection.js"
import userRouter from "./Routers/User.route.js"
import cookieParser from 'cookie-parser'
dbConnection()
const app=express()


app.use(express.json())
app.use(morgan("dev"))
app.use(cookieParser())

app.use("/api/auth",userRouter)

export default app