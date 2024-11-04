const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
//define person schema

const userSchema = new mongoose.Schema({
    
    name:{
        type:String,
        required : true
    },
    age:{
        type:Number,
        required:true
    },
    email:{
        type:String
    },
    mobile:{
        type:Number
    },
    address:{
        type:String,
        required:true
    },
    adharcardNumber:{
        type:Number,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["voter","admin"],
        default:"voter"
    },
    Isvote:{
        type:Boolean,
        default:false
    }

});

//hash the user password using bcrypt 

userSchema.pre("save", async function(next){

    const person = this;

    if(!person.isModified('password')) return next();

    try{
        const salt = await  bcrypt.genSalt(10);
        const hasedpassword = await bcrypt.hash(person.password,salt);

        person.password= hasedpassword;
        next();
    }
    catch(err){
        return next();
    }

});

userSchema.methods.comparePassword = async function(candidatepassword){
    
    try{
        const ismatch = await bcrypt.compare(candidatepassword,this.password);
         return ismatch;
    }
    catch(e){
        throw e;
    }
    
}



const User = new mongoose.model('User',userSchema);
module.exports= User;