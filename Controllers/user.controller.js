import mongoose from "mongoose";
import userModel from "../Models/user.model.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import config from "../config/config.js";


export const register=async (req,res,next)=>{

    const { username,email,password }=req.body
    
    const isAlreadyRegistered=await userModel.findOne({
        username,
        email
    })

    if(isAlreadyRegistered){
        return res.status(409).json({
            success:false,
            message:"user already registerd!"
        })
    }
    const hashedPassword=await bcrypt.hash(password,10)

    const user=await userModel.create({
        username,
        email,
        password:hashedPassword
    })

    const refreshToken=jwt.sign({
        id:user._id
    },config.JWT_SCRET_KEY,{
        expiresIn:"7d"
    })

    res.cookie('refreshToken', refreshToken,{
        httpOnly:true,
        secure:false,
        sameSite:"strict",
        maxAge:7*24*60*60*1000
    });

    const accessToken=jwt.sign({
        id:user._id
    },config.JWT_SCRET_KEY,{
        expiresIn:"15m"
    })

    res.status(201).json({
        success:true,
        message:"User Registered Successfully!",
        accessToken
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

export const refreshPage=(req,res,next)=>{
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