const express = require("express");
const requestRouter = express.Router();
const userAuth = require("../middleware/auth");

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(`${user.firstName}, sends a connection request..!`);
    } catch (err) {
        res.status(401).send("Issue occured while sending connection request.." + err);
    }
});

module.exports = requestRouter;
