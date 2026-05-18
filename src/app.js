require("dotenv").config();

const express=require("express");
const app=express();
const connectDB=require("./config/database");
const User=require("./models/user")
const bcrypt=require("bcrypt")
const cookieParser = require('cookie-parser')
const jwt=require("jsonwebtoken")
const userAuth=require("./middleware/auth")
const cors=require("cors")

app.use(express.json());
app.use(cookieParser())

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

const profileUrlRouter = require("./router/profileUrl");
const authRouter=require("./router/auth")
const profileRouter=require("./router/profile")
const requestRouter=require("./router/request");
const userRouter = require("./router/user");

app.use("/",authRouter)
app.use("/",profileRouter)
app.use("/",requestRouter)
app.use("/",userRouter)
app.use("/", profileUrlRouter);

connectDB().then(()=>{

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});

})
.catch((err)=>{
    console.log("Error connecting to database: "+err.message)
})
