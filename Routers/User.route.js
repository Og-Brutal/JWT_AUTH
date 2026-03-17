import mongoose from "mongoose"
import {Router} from "express"
import * as userController from "../Controllers/user.controller.js"

const userRouter=Router()

// for api /api/auth/register
userRouter.post("/register",userController.register)

// for api /api/auth/get-me
userRouter.get("/get-me",userController.getMe)


// for api /api/auth/refresh-page
userRouter.get("/refresh-page",userController.refreshPage)

export default userRouter

