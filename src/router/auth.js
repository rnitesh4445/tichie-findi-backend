const express = require('express');
const router = express.Router();

const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userAuth=require("../middleware/auth")
router.post("/signup", async (req, res) => {

  try {

    const { firstName, lastName, emailId, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword
    });

    await user.save();

    // CREATE JWT TOKEN
    const token = jwt.sign(
      { _id: user._id },
      "devTender@project"
    );

    // SEND COOKIE
    res.cookie("token", token);

    // SEND USER
    res.send(user);

  } catch (err) {

    res.status(500).send("Error saving user: " + err.message);
  }
});

router.post("/login",async(req,res)=>{
  try{
    const {emailId,password}=req.body;
    const user=await User.findOne({emailId})
      if (!user) {
      throw new Error("Invalid credential");
    }
    const isMatch=await bcrypt.compare(password,user.password);
  
  
     if(!isMatch)
    {
      throw  new Error("invalid credential")
    }
    else{
     const token =jwt.sign({_id:user._id},"devTender@project")
  
      res.cookie("token",token)
   
    
    res.send(user)

    }
  }
  catch(err){
      
      res.status(500).send(err.message)
  }
})

router.post("/logout",async(req,res)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),
    })
    res.send("logout successful")
})

module.exports=router;