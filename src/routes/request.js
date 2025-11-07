const express = require("express");
const requestRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const userAuth = require("../middleware/auth");
const User = require("../models/user");
//sending like or ignoring
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const user = req.user;
      const fromUserId = user._id;
      const { toUserId, status } = req.params;
      if (!["ignored", "interested"].includes(status)) {
        throw new Error("Invalid status type");
      }

      //connection already exists
      const connectionExits = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (connectionExits) {
        throw new Error("Connection already exists");
      }
      if (fromUserId.equals(toUserId)) {
        throw new Error("Cannot send request to self");
      }
      const connection = await ConnectionRequest({
        fromUserId: fromUserId,
        toUserId: toUserId,
        status: status,
      });
      connection.save();
      res.send("Connection request sent");
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
);

//accepting or rejecting request
requestRouter.post(
  "/request/review/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, userId } = req.params;
      const allowedStatus = ["rejected", "accepted"];
      if (!allowedStatus.includes(status)) {
        throw new Error("Invalid status");
      }
      const userExists = await User.findById(userId);
      if (!userExists) {
        throw new Error("User does not exists");
      }

      const connection = await ConnectionRequest.findOne({
        fromUserId: userId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      console.log("connection", connection);
      if (!connection) {
        throw new Error("Connection does not exists");
      }
      connection.status = status;
      await connection.save();
      res.status(200).status(`Connection request` + status);
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
);

module.exports = requestRouter;
