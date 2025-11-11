const express = require("express");
const userRouter = express.Router();
const User = require("../models/user");
const userAuth = require("../middleware/auth");
const connectionRequest = require("../models/connectionRequest");

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await connectionRequest
      .find({
        status: "interested",
        toUserId: loggedInUser._id,
      })
      .populate("fromUserId", ["name", "age", "email", "gender", "skills"]);
    res.status(200).json(connectionRequests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

userRouter.get("/user/connection/accepted", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await connectionRequest
      .find({
        status: "accepted",
        toUserId: loggedInUser._id,
      })
      .populate("fromUserId", ["name", "age", "email", "gender", "skills"]);
    res.status(200).json(connectionRequests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = userRouter;
