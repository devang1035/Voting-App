const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const {midellware ,genrateToken } = require("../jwt");
require("dotenv").config();
 

//signup
router.post("/signup",async(req,res)=>{
    try{

        const data = req.body ; //body contains user informations

        const newUser = new User(data); //create new user
        let user = await newUser.save();

        let payload = {
            id: user.id,   //define payload for token
        }

        let token = await genrateToken(payload);
        console.log("token is :", token);

        return res.status(201).json({message:"User Registerd !"});

    }
    catch(err){
        console.log(err);
        return res.status(500).json({error: 'Internal Server Error'});
    }
});

//login 
router.post("/login",async(req,res)=>{

    try{
        
    const {adharcardNumber , password } = req.body;

    // check adharcard or password exist or not
    if(!adharcardNumber || ! password){
        return res.status(400).json({ error: 'Aadhar Card Number and password are required' });
    }

    //find the user by its adharcard number
    let user = await User.findOne({adharcardNumber : adharcardNumber});

    //check adhar  number and password are correct or not
    if(!user || !(await user.comparePassword(password))){
       return res.status(401).json({message:"adharcard number or password incorrect ! "});
    }
    let payload={
        id:user.id,
    }
    //genrate token for user using payload

    const token = genrateToken(payload);
    res.json({token});
    }
    catch(err){
        console.log(err);
        return res.status(500).json({err:"Something Went Wrong !",err});
    }

});

//user profile section
router.get("/profile",midellware, async(req,res)=>{
    
    try{
    
    let userData = req.user;
    let userId = userData.id;
    let user = await User.findById(userId);

    return res.status(200).json({user});
    
}
    catch(err){
        return res.status(500).json({err:"Something Went Wrong !"});
    }
});


// update profile password 
router.put("/profile/password", midellware, async(req,res)=>{
    
    try{

        //extract the user id from header
        const userId = req.user.id;
        const {currentPassword , newPassword} = req.body;
        
        //check if user current anmd new password exist or not
        if(!currentPassword || !newPassword){
            return res.status(401).json({message:"Both currentPassword and newPassword are required !"});
        }

        //find the user by its id

        const user= await User.findById(userId);

        //check the password is incorrect or not

        if(!user || !(await user.comparePassword(currentPassword))){
            return res.status(401).json({message:"incorrect password !"});
        }
        
        //update password
        user.password = newPassword;
        await user.save();

        console.log("password saved !");
        return res.status(201).json({message:"Password Updated !"});
        
    }
    catch(err){
        console.log(err);
        return res.status(500).json({err:"Something Went Wrong !"});
    }
});



module.exports = router;