const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const {midellware , genrateToken} = require("../jwt");
const Candidate = require("../models/candidateModel");

const checkAdmin = async(userId)=>{

    //check user is admin or not
try{
    const user = await User.findBy(userId);
    if(user.role==admin){
        return true;
    }
}
catch(e){
        return false;
    }
    
}

// create a candidate by admin

router.post("/", midellware ,async(req,res)=>{

    try{

        //check user is admin or not
        if(!checkAdmin(req.user.id)){
            return res.send("you dont have an access to create candidate!");
        }


        const data= req.body;

        const newcandidate = new Candidate(data);
        const response = await newcandidate.save();

        console.log("candidate was saved!");
        return res.status(200).json({response});


    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"Internal Server Error !"});
    }

});

//now we are update our candidate route

router.put("/:candidateId", midellware ,async(req,res)=>{

    try{
        if(!checkAdmin(req.user.id)){
            return res.send("you dont have an acess to update candidate information!");
        }

         //extract id from Url parameters
        const candidateId= req.params.candidateId;
        const updatedCandidate = req.body;

        //update candidate using its id
        const response = await Candidate.findByIdAndUpdate(candidateId, updatedCandidate , {
            new:true,
            runValidators : true
        });

        if(!response){
            return res.status(404).json({message:"Candidate Was Not Found !"});
        }

        console.log("candidate data was updated !");
        return res.status(200).json({messsage:"candidate updated !"});
    }
    catch(err){
        return res.status(500).json({message:"Internal Server Error !"});
    }

});

// candidate delete route
router.delete("/:candidateId", midellware , async(req,res)=>{

    try{

        if(!checkAdmin(req.user.id)){
            return res.send("you dont have an access to delete candidate !").json({message:"you dont have an access to delete candidate !"});
        }
        //extract id from Url parameters
        const candidateId = req.params.candidateId;
        
        //delete candidate using its id
        const response =  await Candidate.findByIdAndDelete(candidateId);
    
        if(!response){
            return res.status(404).json({message:"Candidate Not found !"});
        }
    
        console.log("candidate deleted !");
        return res.status(200).json({msg:"Candidate was deleted !"});

    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"Internal Server Error !"});
    }


});

//voting routes

router.post("/vote/:candidateId", midellware , async(req,res)=>{

    const candidateId = req.params.candidateId;
    const userId = req.user.id;

    try{

        const candidate = await Candidate.findById(candidateId);

        if(!candidate){
            return res.status(404).json({message:"candidate was not found !"});
        }

        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({message:"user not found !"});
        }

        //check user are admin or not 
        if(user.role== 'admin'){
            return res.status(403).json({message:"admin is not allowed !"});
        }

        //check if user already vote or not 
        if(user.Isvote){
            return res.status(403).json({message:"you are already voted !"});
        }

        //update vote
        candidate.votes.push({user:userId});
        candidate.voteCount++;
        await candidate.save();

        //update user document 
        user.Isvote= true;
        await user.save();


       console.log("voted !");
       return res.status(200).json({message:"user voted succesfully !"});

    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"Internal Server Error !"});
    }

});


// live votes count

router.get("/vote/count",async(req,res)=>{

    try{

        //find and sort candidate votecount in descendig order
        const candidate = await Candidate.find().sort({voteCount:"desc"});

        
        const record = candidate.map((data) => {
           return{
            party: data.party,
            count: data.voteCount
           } 
        });

        return res.status(200).json(record);

    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"Internal Server Error !"});
    }

});

//show all candidate 

router.get("/" ,  async(req,res)=>{
    try{

        //extract all candidate name / party / id from database or model 
        const candidates = await Candidate.find({}, 'name party -_id');

        return res.status(200).json(candidates);

    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"Internal Server Error !"});
    }
})


module.exports = router;

