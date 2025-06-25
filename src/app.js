const express = require('express');
const connectDB = require("./config/database");
const User = require("./models/user")

const app = express();



app.post('/signup',async(req,res,next)=>{
    const user1 = new User({firstName: "Ramesh1",lastName: "Pandi",email: "two@gmail.com",password:"ramesh@123"});

    try{
        await user1.save();
        res.send("Data Posted successfullly");
    }
    catch(err){
        next(err);
    }    
});

app.use((err,req,res,next)=>{
    if(err){
        res.status(401).send("GOT issue saving in database..!");
    }
});



connectDB()
.then(()=>{
    console.log("Database connected successfully..!");
    app.listen(3000,()=>{
    console.log('server listening on port 3000');});
})
.catch(()=>{
    console.log("Database is not connected successfully..!");
});


