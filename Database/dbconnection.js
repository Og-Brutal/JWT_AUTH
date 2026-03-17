import config from "../config/config.js";
import mongoose from "mongoose";
const dbConnection=()=>{
    mongoose.connect(config.MONGO_URI)
    .then(()=>{
        console.log("database connected successfully!")
    })
    .catch(()=>{
         console.log("database did'nt connected!")
    })
}

export default  dbConnection