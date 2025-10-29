const express = require("express");
const app = express();
const port = 3000;
const db = require("./config/database");
const User = require("./models/user");
const checkEmailExists = require("./middleware/duplicateEmail");
app.use(express.json());

app.post("/signup", checkEmailExists, async (req, res) => {
  console.log(req.body);
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).send("User signed up");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/users", async (req, res) => {
  console.log("req", req);
  try {
    const users = await User.find({ name: "John Doe" });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch("/users", async (req, res) => {
  console.log("req", req.body);
  const updatedUser = await User.findByIdAndUpdate(req.body._id, req.body, {
    new: true,
  });
  console.log("updatedUser", updatedUser);
  res.status(201).send("Updated User", updatedUser);
});

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
