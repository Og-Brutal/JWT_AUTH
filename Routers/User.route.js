import mongoose from "mongoose"
import {Router} from "express"
import * as userController from "../Controllers/user.controller.js"

const userRouter=Router()




/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
userRouter.post("/register",userController.register)

/**
 * @route GET /api/auth/get-me
 * @desc Get current user information
 * @access Private
 */
userRouter.get("/get-me",userController.getMe)


/** 
 * @route GET /api/auth/refresh-page
 * @desc Refresh access token using refresh token
 * @access Private
 */
userRouter.get("/refresh-page",userController.refreshPage)

/**
 * @route POST /api/auth/logout
 * @desc Logout user by revoking the refresh token
 * @access Private
 */
userRouter.post("/logout",userController.logout)

/**
 * @route POST /api/auth/logout-all
 * @desc Logout user from all devices
 * @access Private
 */
userRouter.post("/logout-all",userController.logoutAll)

/** 
 * @route POST /api/auth/login
 * @desc Login user
 * @access Public
 */
userRouter.post("/login",userController.login)

export default userRouter

