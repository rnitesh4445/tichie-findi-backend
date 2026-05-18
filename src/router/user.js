const express=require('express');
const userAuth = require('../middleware/auth');
const userRouter=express.Router();
const  ConnectionRequest=require("../models/connectionRequest")
const User=require("../models/user")


const UserSafeFields = "firstName lastName skills photoUrl about";
userRouter.get("/user/requests/received",userAuth,async(req,res)=>{
    try{
        const userId=req.user._id;
        const connectionRequests=await ConnectionRequest.find(
            {
                toUserId:userId,
                status:"interested"
            }
        ).populate("fromUserId",UserSafeFields )
        
res.json({message:"Received connection requests fetched successfully!", data:connectionRequests})
    }
    catch(err){
        res.status(500).send("something went wrong"+err.message)
    }
})

userRouter.get("/user/connections",userAuth,async(req,res)=>{

    try{
        const userId=req.user._id;
        const connections=await ConnectionRequest.find(
            {
                $or:[
                    {fromUserId:userId, status:"accepted"},
                    {toUserId:userId, status:"accepted"}
                ]
            }
            ).populate("fromUserId toUserId",UserSafeFields)
            const data=connections.map((raw)=>
            {
                if(raw.fromUserId._id.toString()===userId.toString())
                {
                    return raw.toUserId;
                }
                else{
                    return raw.fromUserId;
                }
            }
                )
res.json({message:"Connections fetched successfully!", data})
    }
    catch(err){
        res.status(500).send("something went wrong"+err.message)
    }
})

userRouter.get("/feed", userAuth, async (req, res) => {

    try {

        const loggedInUserId = req.user._id;

        const connections = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUserId },
                { toUserId: loggedInUserId }
            ]
        }).select("fromUserId toUserId");

        const hideUserFromFeed = new Set();

        connections.forEach((conn) => {

            hideUserFromFeed.add(conn.fromUserId.toString());

            hideUserFromFeed.add(conn.toUserId.toString());

        });

        const users = await User.find({
            _id: {
                $nin: Array.from(hideUserFromFeed),
                $ne: loggedInUserId
            }
        }).select(UserSafeFields);

        res.send(users);

    }
    catch (err) {

        res.status(500).send("something went wrong " + err.message);

    }

});
module.exports=userRouter;