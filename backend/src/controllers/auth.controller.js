import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from 'bcrypt';

export const signup = async (req,res)=>{
    const {fullName,email,password} = req.body;
    if(!fullName || !email || !password){
        return res.status(400).json({message:"Please provide all the fields"});
    }
    if(password.length < 5){
        return res.status(400).json({message:"Password must be at least 5 characters long"});
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)){
        return res.status(400).json({message:"Invalid email"});
    }
    try{
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"User already exists"});
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = new User({fullName,email,password:hashedPassword});
        if(newUser){
            generateToken(newUser._id,res);
            await newUser.save();
            res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                email:newUser.email,
               profilePic:newUser.profilePic
            });

        } else {
            return res.status(500).json({message:"Internal server error"});

        }
        return res.status(201).json({message:"User created successfully"});
    }catch(error){
        return res.status(500).json(error.message);
    }
}