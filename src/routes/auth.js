const express = require("express");
const User = require("../models/user");
const validateData = require("../utils/validator");
const bcrypt = require("bcrypt");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res, next) => {
    try {
        validateData(req);
        const { firstName, lastName, emailId, password } = req.body;
        const passwordHashed = await bcrypt.hash(password, 10);
        // creating document
        const user1 = new User({ firstName, lastName, emailId, password: passwordHashed });
        await user1.save();
        res.send("Data Posted successfullly");
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
            res.send("Login Successfully..!🥳");
        } else {
            throw new Error("Invalid Password..!❌");
        }
    } catch (err) {
        res.status(401).send("Issue occured while logging up..!" + err);
    }
});

module.exports = authRouter;
