import mongoose from "mongoose";


const sessionSchema=mongoose.Schema({
    userID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:[true,"userID is required"]
    },
    refrehTokenHashed:{
        type:String,
        required:[true,"refrehTokenHashed is required"]
    },
    ip:{
        type:String,
        required:[true,"ip is required"]
    },
    userAgent:{
        type:String,
        required:[true,"userAgent is required"]
    },
    revoke:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})


const sessionModel=mongoose.model("Session",sessionSchema)

export default sessionModel