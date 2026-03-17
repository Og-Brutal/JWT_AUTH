import dotenv from "dotenv";

dotenv.config();

if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing in .env");
}
if (!process.env.JWT_SCRET_KEY) {
    throw new Error("JWT_SCRET_KEY is missing in .env");
}

export default {
    MONGO_URI: process.env.MONGO_URI,
    JWT_SCRET_KEY:process.env.JWT_SCRET_KEY
};