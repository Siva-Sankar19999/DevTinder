const express = require('express');
const userRouter = express.Router();
const userAuth = require('../middleware/auth');
const connectionRequests = require('../models/connectionRequests');
const User = require('../models/user');

const USER_SAFE_DATA = "firstName lastName photoURL age gender skills";

userRouter.get('/user/requests/received/',userAuth,async(req,res)=>{
    try{
        const loggedInUser = req.user;

        const fetchConnections = await connectionRequests.find({
            toUserId : loggedInUser,
            status: "interested"
        })
        .populate("fromUserId",USER_SAFE_DATA);

        

        res.json({
            messgage : "Data fetched successfully..!",
            data : fetchConnections
        });

    }
    catch(err){
       res.status(404).send("Error while fetching requests..!"+ err);
    }
});

userRouter.get('/user/connections',userAuth,async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const connections = await connectionRequests.find({
            $or: [
                {fromUserId: loggedInUser, status: "accepted"},
                {toUserId: loggedInUser, status: "accepted"}
            ]
        })
        .populate("fromUserId",USER_SAFE_DATA)
        .populate("toUserId",USER_SAFE_DATA);

       if(!connections){
        return res
               .send("no connections");
       }

       const data = connections.map((row) => {
        if(row.fromUserId._id.toString() == loggedInUser._id.toString()){
            return row.toUserId;
           
        }
        return row.fromUserId;
       }
    );
    res.json({
            data: data
        })}
    catch(err){
        res.status(404).send("Error while fetching connections..!")
    }
});

userRouter.get('/feed',userAuth,async(req,res)=>{
    try{
        const loggedInUser = req.user;
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        
        limit = limit > 50 ? 50 : limit; 

        const skip = (page-1)*limit;

        const connections = await connectionRequests.find(
            {$or:[{fromUserId:loggedInUser._id},{toUserId: loggedInUser._id}]}
        ).select('fromUserId toUserId');

        const hideConnections = new Set();
        connections.forEach(req=>{
            hideConnections.add(req.fromUserId.toString());
            hideConnections.add(req.toUserId.toString());
        });
        
        const users = await User.find({
            $and:[
            {_id: {$nin: Array.from(hideConnections)}},
            {_id: {$ne: loggedInUser._id}}
            ]
        })
        .select(USER_SAFE_DATA)
        .skip(skip)
        .limit(limit);

        res.send(users);
    }
    catch(err){
        res.status(404).send("Error while getting feed data"+err);
    }
});

module.exports = userRouter;
