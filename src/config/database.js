const mongoose=require("mongoose")
const DB_String=require("../config/env").DB_String;
const connectDB=async()=>{
    await mongoose.connect(DB_String)
}
module.exports=connectDB;