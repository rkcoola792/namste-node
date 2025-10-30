const express = require("express");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const app = express();
const port = 3000;
const db = require("./config/database");
const User = require("./models/user");
const checkEmailExists = require("./middleware/duplicateEmail");
const { isStrongPassword } = require("./utils/strongPassword");
app.use(express.json());

app.post("/signup", checkEmailExists, async (req, res) => {
  const { name, email, password, age, gender } = req.body;
  const strongPassword = await isStrongPassword(req.body.password);
  const salt = bcrypt.genSaltSync(saltRounds);
  const encryptedPassword = bcrypt.hashSync(req.body.password, salt);
  try {
    if (!strongPassword) {
      throw new Error("Password is not strong enough");
    }
    const newUser = new User({
      name,
      email,
      password: encryptedPassword,
      age,
      gender,
    });
    await newUser.save();
    res.status(201).send("User signed up");
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
    console.log("updatedUser", updatedUser);
    res.status(201).send("Updated User", updatedUser);
  }
);

app.delete("/users/:id", async (req, res) => {
  console.log("req", req.params.id);
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    console.log("deletedUser", deletedUser);
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
