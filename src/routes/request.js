const express = require("express");
const requestRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const userAuth = require("../middleware/auth");

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

module.exports = requestRouter;
