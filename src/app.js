const express = require("express");
const { createHash, compareHash } = require("./utils/createHash");
const validator = require("validator");
const app = express();
const port = 3000;
const db = require("./config/database");
const User = require("./models/user");
const checkEmailExists = require("./middleware/duplicateEmail");
const { isStrongPassword } = require("./utils/strongPassword");
const cookieParser = require("cookie-parser");
const userAuth = require("./middleware/auth");
app.use(cookieParser());
app.use(express.json());

app.post("/signup", checkEmailExists, async (req, res) => {
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

app.post("/login", async (req, res) => {
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

app.get("/profile", userAuth, async (req, res) => {
  res.status(200).json(req.user);
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const targetUserId = req.body.targetUserId;

    res.status(200).send("Connection request sent");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find({ name: "John Doe" });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch(
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

app.delete("/users/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    res.status(200).send("Deleted User");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.delete("/users", async (req, res) => {
  try {
    const deletedUser = await User.deleteMany({ email: req.body.email });
    res.status(200).send("Deleted User");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

db().then(() => {
  console.log("Database connection established");
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
});
