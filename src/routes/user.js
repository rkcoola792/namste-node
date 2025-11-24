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
        $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
      })
      .populate("fromUserId", ["name", "age", "email", "gender", "skills"])
      .populate("toUserId", ["name", "age", "email", "gender", "skills"]);
    res.status(200).json(
      connectionRequests.map((row) => {
        if (row.fromUserId._id.equals(loggedInUser._id)) {
          return row.toUserId;
        } else return row.fromUserId;
      })
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const connection = await connectionRequest
      .find({
        $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
      })
      .select("fromUserId toUserId");
    const hideUsersFromFeed = new Set();
    hideUsersFromFeed.add(loggedInUser._id.toString());
    connection.forEach((conn) => {
      hideUsersFromFeed.add(conn.fromUserId.toString());
      hideUsersFromFeed.add(conn.toUserId.toString());
    });

    const users = await User.find({
      _id: { $nin: Array.from(hideUsersFromFeed) },
    })
      .select("name age email gender skills profileImage")
      .skip(skip)
      .limit(limit);
    if (users) {
      res.status(200).json(users);
    } else {
      res.status(200).json([]);
    }
  } catch (error) {
    res.status(400).send("Internal Server Error", error.message);
  }
});

module.exports = userRouter;
