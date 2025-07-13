const express = require('express');
const userRouter = express.Router();
const userAuth = require('../middleware/auth');
const connectionRequests = require('../models/connectionRequests');

userRouter.get('/user/requests/received/',userAuth,async(req,res)=>{
    try{
        const loggedInUser = req.user;

        const fetchConnections = await connectionRequests.find({
            toUserId : loggedInUser,
            status: "interested"
        }).populate("fromUserId","firstName lastName");

        res.json({
            messgage : "Data fetched successfully..!",
            data : fetchConnections
        });

    }
    catch(err){
       res.status(404).send("Error while fetching requests..!"+ err);
    }
});

module.exports = userRouter;
