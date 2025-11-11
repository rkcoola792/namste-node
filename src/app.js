const express = require("express");
const authRouter = require("./routes/auth");
const app = express();
const port = 3000;
const db = require("./config/database");
const cookieParser = require("cookie-parser");
const userAuth = require("./middleware/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
app.use(cookieParser());
app.use(express.json());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);


db().then(() => {
  console.log("Database connection established");
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
});
