
export const genrateOTP=()=>{
    const otp=Math.floor(100000 + Math.random() * 900000)
    return otp.toString()
}

export const getOTPHtml=(otp)=>{
    return `
    <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
        <h2>Your OTP</h2>
        <p>Please use the following OTP to verify your email:</p>
        <h3>${otp}</h3>
    </div>
    `;
}