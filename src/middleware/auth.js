const jwt=require("jsonwebtoken");
const User=require("../models/user")
const jwtSecret_key=require("../config/env").jwtSecret_key;

const userAuth=async(req,res,next)=>{
    try{
        const token=req.cookies.token;
        if(!token)
        {
            throw new Error("token is not present")
        }
        const decode=jwt.verify(token,jwtSecret_key)
        const {_id}=decode;
        const user=await User.findById(_id);
        if(!user)
        {
            throw new Error("user is not present")
        }
        req.user=user;
        next();
    }
    catch(err){
        res.status(500).send("something went wrong"+err.message)
    }
}
module.exports=userAuth;
