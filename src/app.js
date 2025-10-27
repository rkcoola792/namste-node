const express = require("express");
const app = express();
const port = 3000;
const db = require("./config/database");
const User = require("./models/user");

app.post("/signup", async (req, res) => {
  const newUser = new User({
    name: "John Doe",
    age: 30,
    email: "tHc3o@example.com",
  });
  await newUser.save().then(() => console.log("User saved"));
  res.status(201).send("User signed up");
});

db().then(() => {
  console.log("Database connection established");
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
});
