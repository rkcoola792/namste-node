const express = require("express");
const profileRouter = express.Router();
const User = require("../models/user");

profileRouter.get("/users", async (req, res) => {
  try {
    const users = await User.find({ name: "John Doe" });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

profileRouter.patch(
  "/users/:id",
  (req, res, next) => {
    const unique = [...new Set(req.body.skills)];
    req.body.skills = unique;
    next();
  },
  async (req, res) => {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(201).send("Updated User", updatedUser);
  }
);

profileRouter.delete("/users/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    res.status(200).send("Deleted User");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
profileRouter.delete("/users", async (req, res) => {
  try {
    const deletedUser = await User.deleteMany({ email: req.body.email });
    res.status(200).send("Deleted User");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = profileRouter;
