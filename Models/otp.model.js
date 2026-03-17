import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "email is required!"]
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: [true, "userID is required!"]
    },
    otpHash: {
        type: String,
        required: [true, "otp is required!"]
    },
}, {
    timestamps: true
});

const otpModel = mongoose.model("OTP", otpSchema);

export default otpModel;