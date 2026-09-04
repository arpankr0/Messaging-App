import "dotenv/config";
import User from "../models/User.js";
import jwt from 'jsonwebtoken';

export const protectRoute = async(req,res,next)=>{

    try{
        const token = req.cookies.jwt;
        if(!token)  return res.status(401).json({message:"Unauthorized"});

        const decoded = await jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded) return res.status(401).json({message:"Unauthorized token"});

        const user = await User.findById(decoded.userId).select("-password")
        if(!user) return res.status(401).json({message:"User not found"});
        req.user=user;
        next();


    } catch(error){
        console.log("Error in protected middleware",error);
        res.status(500).json({message:"Internal server error"});

    }


}