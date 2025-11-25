const express = require("express");
const checkEmailExists = require("../middleware/duplicateEmail");
const { isStrongPassword } = require("../utils/strongPassword");
const { createHash } = require("../utils/createHash");
const validator = require("validator");
const User = require("../models/user");
const profileRouter = require("./profile");
const authRouter = express.Router();

authRouter.post("/signup", checkEmailExists, async (req, res) => {
  const { name, email, password, age, gender, skills, profileImage, bio } =
    req.body;
     
  const strongPassword = await isStrongPassword(req.body.password);
  const hash = createHash(password);
  try {
    if (!strongPassword) {
      throw new Error("Password is not strong enough");
    }
    console.log("req", req.body);
    const newUser = new User({
      name,
      email,
      password: hash,
      age,
      gender,
      skills,
      profileImage,
      bio,
    });
    await newUser.save();
    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const isValidEmail = validator.isEmail(email);
    if (!isValidEmail) {
      throw new Error("Invalid email");
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }
    const token = await user.getJWT();
    res.cookie("token", token);
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});
profileRouter.post("/logout", async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).send("Logout successful");
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = authRouter;
