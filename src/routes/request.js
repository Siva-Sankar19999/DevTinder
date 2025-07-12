const express = require("express");
const requestRouter = express.Router();
const userAuth = require("../middleware/auth");
const connectionRequest = require("../models/connectionRequests");
const User = require("../models/user");

requestRouter.post("/request/send/:status/:userId", userAuth, async (req, res) => {
    try {
        const status = req.params.status;
        const toUserId = req.params.userId;
        const fromUserId = req.user._id;

        const allowedStatus = ["interested", "ignored"];
        const isStatusAllowed = allowedStatus.includes(status);
        if (!isStatusAllowed) {
            return res.status(400).send("Status is not alloed.!");
        }

        const validToUserId = await User.findById(toUserId);
        if (!validToUserId) {
            return res.status(404).send("Requested user is not present in our database");
        }

        const existingConnectionRequest = await connectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId },
            ],
        });
        if (existingConnectionRequest) {
            return res.status(400).send("Existing Request already there...!");
        }

        const connectionObject = new connectionRequest({ fromUserId: fromUserId, toUserId: toUserId, status: status });
        const connectionDataSent = await connectionObject.save();

        res.send(`${req.user.firstName} sends a connectionRequest to ${validToUserId.firstName}`);
    } catch (err) {
        res.status(401).send("Issue occured while sending connection request.." + err);
    }
});

module.exports = requestRouter;
