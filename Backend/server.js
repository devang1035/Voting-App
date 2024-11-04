const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;
const bodyparser = require("body-parser");
const user = require("./routes/userRoute"); 
const candidate = require("./routes/candidateRoute");
const db = require("./db");
require("dotenv").config();

app.use(bodyparser.json()); //req body midellware

app.use("/user",user); //user route midlleware
app.use("/candidate",candidate); //candidate route midlleware



app.listen(PORT , ()=>{
    console.log(`app is listen to ${PORT}`);
})
