import dotenv from "dotenv";

dotenv.config();

if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing in .env");
}
if (!process.env.JWT_SCRET_KEY) {
    throw new Error("JWT_SCRET_KEY is missing in .env");
}
if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error("GOOGLE_CLIENT_ID is missing in .env");
}
if (!process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error("GOOGLE_CLIENT_SECRET is missing in .env");
}
if (!process.env.GOOGLE_REFRESH_TOKEN) {
    throw new Error("GOOGLE_REFRESH_TOKEN is missing in .env");
}
if (!process.env.GOOGLE_USER) {
    throw new Error("GOOGLE_USER is missing in .env");
}


export default {
    MONGO_URI: process.env.MONGO_URI,
    JWT_SCRET_KEY:process.env.JWT_SCRET_KEY,
    GOOGLE_CLIENT_ID:process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET:process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REFRESH_TOKEN:process.env.GOOGLE_REFRESH_TOKEN,
    GOOGLE_USER:process.env.GOOGLE_USER
};