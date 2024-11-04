const jwt = require("jsonwebtoken");


//check user authorized / authenticate or not

const midellware = (req, res, next)=>{

    //1. check the user authorized or not . 

    const auth = req.headers.authorization;
    if(!auth){
        return res.status(401).json({message:"not found!"});
    }

    //2. extract the jwt token from request headers

    const token = req.headers.authorization.split(' ')[1];

    if(!token){
        return res.status(401).json({message:"not found!"});
    }

    //3. verify jwt token

    try{

        const decoded = jwt.verify(token,process.env.SECRET);

        //attach user info to request headers

        req.user = decoded;
        next(); 

    }catch(err){
        res.status(401).json({message:"invalid token!"})
    }



}

//genrate token for user

const genrateToken = (userdata)=>{
    return jwt.sign(userdata,process.env.SECRET,{expiresIn:300000000000});
}

module.exports = {midellware , genrateToken};