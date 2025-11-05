const express = require("express");
const profileRouter = express.Router();
const userAuth = require("../middleware/auth");
const { isStrongPassword } = require("../utils/strongPassword");
const { createHash } = require("../utils/createHash");
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  res.status(200).json(req.user);
});

profileRouter.patch("/profile/update", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const updates = req.body;
    Object.keys(updates).forEach((key) => {
      loggedInUser[key] = updates[key];
    });
    await loggedInUser.save();
    res.status(200).send("Profile updated successfully");
  } catch (error) {
    res.status(500).send("Internal Server Error", error);
  }
});
profileRouter.post("/profile/password", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { oldPassword, newPassword, confirmNewPassword } = req.body;
    const isValidPassword = await loggedInUser.validatePassword(oldPassword);
    if (!isValidPassword) {
      throw new Error("Old password is incorrect");
    }
    if (newPassword !== confirmNewPassword) {
      throw new Error("New password and confirm password do not match");
    }
    const strongPassword = await isStrongPassword(newPassword);
    if (!strongPassword) {
      throw new Error("Password is not strong enough");
    }
    const hash = createHash(newPassword);
    loggedInUser.password = hash;
    await loggedInUser.save();
    res.clearCookie("token");
    res.status(200).send("Password updated successfully");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = profileRouter;
