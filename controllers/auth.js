import { validationResult } from "express-validator";
import bcrypt from"bcrypt"
import User from"../models/User.js";
import jwt from "jsonwebtoken";

async function signup(req,res)
{
    let erros=validationResult(req);
    if(!erros.isEmpty()){
        return res.status(422).json({message:erros.array()[0]});
    }
    let {email,name,password}=req.body;
    let hashedPassword=await bcrypt.hash(password,12);
    let user=new User({email:email,userName:name,password:hashedPassword});
    await user.save();
    res.status(201).json({message:"user signed up succesfully",userId:user._id});

}



async function login(req,res)
{
    let{email,password}=req.body;
    let existUser=await User.findOne({email:email});

    if(!existUser)
    {
       return res.status(401).json({ message:"invalid email" });

    }

    let correctPassword=await bcrypt.compare(password,existUser.password);
    if(!correctPassword)
    {
      return res.status(401).json({ message: "invalid password" });
    }

    let token=jwt.sign({email:existUser.email,userId:existUser._id.toString()},"supersecret",{expiresIn:"1h"});

    return res.status(200).json({ token:token,userId:existUser._id.toString()});

}


export{signup,login};



