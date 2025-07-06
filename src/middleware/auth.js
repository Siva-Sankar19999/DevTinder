const jwt = require('jsonwebtoken');
const User = require('../models/user');




const userAuth =async (req,res,next)=>{
    try{
        const {token} = req.cookies;
        if(!token){
            throw new Error("No Token Found");
        }
        const decodedMsg = await jwt.verify(token,'DEV@TENDER$01');
        const { userId } = decodedMsg;

        if(!userId){
            throw new Error("No user Found in token");
        }
        const userInfo = await User.findById(userId);
        req.user = userInfo;
        next();
    }catch(err){
        res.status(401).send("Error in user authentication.. "+err);
    }
}

module.exports = userAuth;