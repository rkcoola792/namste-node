const express = require('express');
const checkEmailExists = require('../middleware/duplicateEmail');
const { isStrongPassword } = require('../utils/strongPassword');
const { createHash } = require('../utils/createHash');
const validator = require("validator");
const User = require('../models/user');
const authRouter = express.Router();

authRouter.post("/signup", checkEmailExists, async (req, res) => {
  const { name, email, password, age, gender } = req.body;
  const strongPassword = await isStrongPassword(req.body.password);
  const hash = createHash(password);
  try {
    if (!strongPassword) {
      throw new Error("Password is not strong enough");
    }
    const newUser = new User({
      name,
      email,
      password: hash,
      age,
      gender,
    });
    await newUser.save();
    res.status(201).send("User signed up");
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
    console.log(req.cookies);
    res.status(200).send("Login successful");
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});
module.exports = authRouter;