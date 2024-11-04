const mongoose = require("mongoose");
require("dotenv").config();
const mongoUrl= process.env.MONGO;

mongoose.connect(mongoUrl,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//db maintain mongoose connections 
const db = mongoose.connection;

db.on("connected",()=>{
    console.log("database connected !");
});

db.on("error",()=>{
    console.log("Something error occured in database connections !");
});

db.on("disconnected",()=>{
    console.log("you'r disconnected !");
});

module.exports= db;


