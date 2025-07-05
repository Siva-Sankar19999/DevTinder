const express = require('express');
const connectDB = require("./config/database");
const User = require("./models/user");
const validateData = require('./utils/validator');
const bcrypt = require('bcrypt');

const app = express();

app.use(express.json());



app.post('/signup',async(req,res,next)=>{

    try{
        validateData(req);
        const {firstName, lastName, emailId, password} = req.body;
        
        const passwordHashed =await bcrypt.hash(password,10);
        


        const user1 = new User({firstName,lastName,emailId,password:passwordHashed});

        
         
        await user1.save();
        res.send("Data Posted successfullly");
    }
    catch(err){
        res.status(401).send("Issue occured while signing up..!"+ err);
    }

    
});

// get user
app.get("/user",async(req,res)=>{
    const userEmail = req.body.password;
    try{
        const user = await User.find({password:userEmail});
        console.log(user);
        if(user.length == 0){
            res.status(404).send("User not found");
        }
        else {
            res.send(user);
        }
            
    
    }
    catch(err){
        res.send("Error occured while fetching Database..!");
    }
});


//Feed API to get all the users
app.get("/feed",async(req,res)=>{
    try{
        console.log("coming to this route..!");
        
        const users = await User.find({});
        if(users.length == 0){
            res.status(404).send("No users found for this route");
        }
        else{
            res.send(users);
        }
    }
    catch(err){
        res.status(403).send("Error occured connecting database..!");
    }
    
});

// Delete API
app.delete('/deleteUser',async(req,res)=>{
    const user = req.body.id;
    try{
        const deletedValue = await User.findByIdAndDelete(user);
        res.send(deletedValue);

    }
    catch(err){
        res.status(404).send('Error occured in deleting data..!');
    }
});

//update API
app.patch("/updateUser/:userId",async (req,res)=>{
    const id = req.params?.userId;
    console.log(id,"checking ID value..!");
    const data = req.body;
    
    
    try{

        const ALLOWED_FIELDS = ["lastName","firstName","age","gender"];
        const isAllowed = Object.keys(req.body).every((input)=>{return ALLOWED_FIELDS.includes(input)});
        if(!isAllowed){
            throw new Error("Update not allowed..!");
        }
        let beforeData = await User.findByIdAndUpdate(id,data);
        console.log(beforeData);
        res.send("Data updated successfully..!");

    }
    catch(err){
        res.status(404).send("Error occured in updating user..!"+err);
    }
    
});


app.use((req,res)=>{
    res.status(404).send("No Route there for that request..!");
});



app.use((err,req,res,next)=>{
    console.log("executing..!");
    if(err){
        res.status(401).send("GOT issue ..!");
    }
    else{
        res.status(404).send("No route there bhayaa...!");
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


