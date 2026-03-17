import mongoose from "mongoose";
import userModel from "../Models/user.model.js";
import crypto from "crypto"
import jwt from "jsonwebtoken"
import config from "../config/config.js";
import sessionModel from "../Models/session.model.js";
import { genrateOTP,getOTPHtml } from "../utils/otpUtil.js";
import { sendEmail } from "../services/email.service.js";
import otpModel from "../Models/otp.model.js";

export const register=async (req,res,next)=>{

    const { username,email,password }=req.body
    
    const isAlreadyRegistered=await userModel.findOne({
        $or:[
            {email},
            {username}
        ]
    })

    if(isAlreadyRegistered){
        return res.status(409).json({
            success:false,
            message:"user already registerd!"
        })
    }
    const hashedPassword= crypto.createHash("sha256").update(password).digest("hex")

    const user=await userModel.create({
        username,
        email,
        password:hashedPassword
    })

    const otp=genrateOTP()
    const otpHash=crypto.createHash("sha256").update(otp).digest("hex")
    await sendEmail(email,"OTP for email verification",`Your OTP is ${otp}`,getOTPHtml(otp))

    await otpModel.create({
        email,
        userID:user._id,
        otpHash
    })
  

    res.status(201).json({
        success:true,
        message:"User Registered Successfully!",
        user:{
            id:user._id,
            username:user.username,
            email:user.email,
            verified:user.verified
        }
    })
}

export const getMe=async (req,res,next)=>{
    const token=req.headers.authorization?.split(" ")[ 1 ]

    if(!token){
        return res.status(401).json({
            success:false,
            message:"token not found!"
        })
    }


    const userData=jwt.verify(token,config.JWT_SCRET_KEY)
    console.log("USERID : " ,userData)
    const user = await userModel.findOne({
        _id:userData.id
    })

    res.status(200).json({
        success:true,
        message:"User Found!",
        user
    })
}

export const refreshPage=async (req,res,next)=>{
    console.log("HERE")
    let refreshToken=req.cookies.refreshToken
    console.log("THERE",refreshToken)

    if(!refreshToken){
        return res.status(401).json({
            success:false,
            message:"refresh token not found!"
        })
    }
    console.log("refreshToken",refreshToken)

    const decoded=jwt.verify(refreshToken,config.JWT_SCRET_KEY)
    const refreshTokenHashed=crypto.createHash("sha256").update(refreshToken).digest("hex")
    const session=await sessionModel.findOne({
        userID:decoded.id,
        refrehTokenHashed:refreshTokenHashed,
        revoke:false
    })

    if(!session){
        return res.status(401).json({
            success:false,
            message:"invalid refresh token!"
        })
    }

    console.log("decode",decoded)

    const accessToken=jwt.sign({
        id:decoded.id
    },config.JWT_SCRET_KEY,{
        expiresIn:"15m"
    })

    res.status(200).json({
        success:true,
        message:"Token updated successfully",
        accessToken
    })

}

export const logout=async (req,res,next)=>{
    let refreshToken=req.cookies.refreshToken

    if(!refreshToken){
        return res.status(401).json({
            success:false,
            message:"refresh token not found!"
        })
    }

    const decoded=jwt.verify(refreshToken,config.JWT_SCRET_KEY)

    const refreshTokenHashed= crypto.createHash("sha256").update(refreshToken).digest("hex")

    const session=await sessionModel.findOne({
        userID:decoded.id,
        refrehTokenHashed:refreshTokenHashed,
        revoke:false
    })

    if(!session){
        return res.status(401).json({
            success:false,
            message:"invalid refresh token!"
        })
    }

    session.revoke=true
    await session.save()

    res.clearCookie("refreshToken")

    res.status(200).json({
        success:true,
        message:"Logged out successfully!"
    })

}

export const logoutAll=async (req,res,next)=>{
    let refreshToken=req.cookies.refreshToken
    
    if(!refreshToken){
        return res.status(401).json({
            success:false,
            message:"refresh token not found!"
        })
    }  

    const decoded=jwt.verify(refreshToken,config.JWT_SCRET_KEY)

    await sessionModel.updateMany({
        userID:decoded.id,
        revoke:false
    },{
        
            revoke:true
        
    })

    res.clearCookie("refreshToken")

    res.status(200).json({
        success:true,
        message:"Logged out from all devices successfully!"
    })
}

export const login=async (req,res,next)=>{

    const {email,password}=req.body

    const isPresent=await userModel.findOne({
        email
    })

    if(!isPresent){
        return res.status(404).json({
            success:false,
            message:"user not found!"
        })
    }


    const hashedPassword=crypto.createHash("sha256").update(password).digest("hex")

    if(isPresent.password!==hashedPassword) {
        return res.status(401).json({
            success:false,
            message:"invalid credentials!"
        })
    }

    if(!isPresent.verified){
        return res.status(403).json({
            success:false,
            message:"email not verified!"
        })
    }

    const refreshToken=jwt.sign({
        id:isPresent._id
    },config.JWT_SCRET_KEY,{
        expiresIn:"7d"
    })
    
    res.cookie("refreshToken", refreshToken,{
        httpOnly:true,
        secure:false,
        sameSite:"strict",
        maxAge:7*24*60*60*1000
    })

    const session=await sessionModel.create({
        userID:isPresent._id,
        refrehTokenHashed:crypto.createHash("sha256").update(refreshToken).digest("hex"),
        ip:req.ip,
        userAgent:req.headers["user-agent"]
    })

    const accessToken=jwt.sign({
        id:isPresent._id,
        sessionID:session._id
    },config.JWT_SCRET_KEY,{
        expiresIn:"15m"
    })

    res.status(200).json({
        success:true,
        message:"Login successful!",
        accessToken
    })


}


export const verifyEmail=async (req,res,next)=>{
    const { email,otp }=req.body
    const hasedOTP=crypto.createHash("sha256").update(otp).digest("hex")
    const otpRecord=await otpModel.findOne({
        email,
        otpHash:hasedOTP
    })


    if(!otpRecord){
        return res.status(400).json({
            success:false,
            message:"Invalid OTP!"
        })
    }

    const user=await userModel.findByIdAndUpdate(otpRecord.userID,{
        verified:true
    })

    await otpModel.deleteMany({
        email
    })

    res.status(200).json({
        success:true,
        message:"Email verified successfully!",
        user:{
            id:user._id,
            username:user.username,
            email:user.email,
            verified:user.verified
        }
    })
}