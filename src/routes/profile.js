const express = require("express");
const profileRouter = express.Router();
const userAuth = require("../middleware/auth");
const {validateProfileEditData} = require('../utils/validator');

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch (err) {
        res.status(401).send("Issue occured while getting profile.." + err);
    }
});


profileRouter.post("/profile/edit",userAuth,async (req,res)=>{
    try{
        if(!validateProfileEditData(req)){
            throw new Error("Cannot update requested fields..!");
        }
        const loggedInUser = req.user;
        Object.keys(req.body).forEach(key=>loggedInUser[key]=req.body[key]);
        console.log(loggedInUser,"logged In user..!");
        await loggedInUser.save();
        
        res.json({
            message : "Profile updated successfully..!",
            data : loggedInUser
        });
    }catch(err){
         res.send("Error +"+ err);
    }
})


module.exports = profileRouter;



