const express = require("express");
const { createHash, compareHash } = require("./utils/createHash");
const authRouter = require("./routes/auth");
const app = express();
const port = 3000;
const db = require("./config/database");
const User = require("./models/user");
const cookieParser = require("cookie-parser");
const userAuth = require("./middleware/auth");
const profileRouter = require("./routes/profile");
app.use(cookieParser());
app.use(express.json());

app.use("/", authRouter);
app.use("/", profileRouter);
// app.use("/", profile);
// app.use("/", authRouter);

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

db().then(() => {
  console.log("Database connection established");
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
});
