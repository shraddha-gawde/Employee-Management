const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");
const { userModel } = require("../models/user.model"); 
const { blacklistModel } = require("../models/blacklist.model")

const register = async (req, res) => {
    const { email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ msg: "Passwords do not match!" });
    }

    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: "User already exists!" });
        }

        
        const hashedPassword = await bcrypt.hash(password, 10);

        
        const newUser = new userModel({ email, password: hashedPassword });
        await newUser.save();

        res.status(200).json({ msg: "User registered successfully!" });
    } catch (error) {
        res.status(500).json({ msg: "Internal server error" });
        console.log(error)
    }
};

const login = async(req, res)=>{
    const { email, password, } = req.body
    try{
        const user = await userModel.findOne({email})
        const name = user.username
        console.log(user)
        if(user){
            bcrypt.compare(password, user.password, (err, result)=>{
                if(err){
                    res.status(200).json({msg:"check email and password correctly!!!"})
                }
                if(result){
                    const secret_key = process.env.secretkey
                    const access_token = jwt.sign({ userID:user._id , username:user.username}, secret_key, {expiresIn : "1d"});
                    const refresh_token = jwt.sign({ userID:user._id , username:user.username}, secret_key,{ expiresIn : "14d"});

                    res.cookie("access_token", access_token, {httpOnly: true})
                    res.cookie("refresh_token", refresh_token, {httpOnly: true})

                    res.status(200).json({msg:"Login successful!", name, access_token, refresh_token})
                }
                else{
                    res.status(201).json({msg:"password is wrong!!!"})
                }
            })
        }else{
            res.status(200).json({msg:"user Does not exists!!!"})
        }
    }catch(err){
        res.status(400).json({error:err})
    }
}

const logout = async(req, res)=>{
    const access_token = req.cookies.access_token;
    const refresh_token = req.cookies.refresh_token;
  
    try {
      const blacklist = new blacklistModel({ access_token, refresh_token });
      await blacklist.save();
  
      res.clearCookie("access_token");
      res.clearCookie("refresh_token");
  
      res.status(200).json({ msg: "User has been logged out" });
    } catch (err) {
      res.status(400).json({ error:err});
      console.log(err)
    }
}



module.exports={
    register,
    login,
    logout
}