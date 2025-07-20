const express = require("express");
const User = require("../models/user");
const {validateSignupData} = require("../utils/validator");
const bcrypt = require("bcrypt");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res, next) => {
    try {
        validateSignupData(req);
        const { firstName, lastName, emailId, password, age,skills, gender, photoUrl, about  } = req.body;
        const passwordHashed = await bcrypt.hash(password, 10);
        // creating document  
        const user1 = new User({ firstName, lastName, emailId, password: passwordHashed, age: age,skills: skills, gender: gender, photoUrl:photoUrl, about: about});
        await user1.save();
        res.send(`Hey, ${user1.firstName} thanks for signing up into the app..!`);
    } catch (err) {
        res.status(401).send("Issue occured while signing up..!" + err);
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("Invalid Email-Id...");
        }
        const isPaswordValid = await user.validatePassword(password);

        if (isPaswordValid) {
            const token = await user.generateJWT();
            res.cookie("token", token, { expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
            res.send(`${user.firstName}, logged in successfully..!`);
        } else {
            throw new Error("Invalid Password..!❌");
        }
    } catch (err) {
        res.status(401).send("Issue occured while logging up..!" + err);
    }
});

authRouter.post("/logout",async(req,res)=>{
    res.cookie('token','',{expires: new Date(Date.now())});
    res.send('You are logged out...! 🙋‍♂️');
});

module.exports = authRouter;
