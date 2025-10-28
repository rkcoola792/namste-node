const express = require("express");
const app = express();
const port = 3000;
const db = require("./config/database");
const User = require("./models/user");
app.use(express.json());

app.post("/signup", async (req, res) => {
  console.log(req.body);
  const newUser = new User(req.body);
  await newUser.save().then(() => console.log("User saved"));
  res.status(201).send("User signed up");
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

db().then(() => {
  console.log("Database connection established");
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
});
