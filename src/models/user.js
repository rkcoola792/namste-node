const mongoose = require("mongoose");

const user = new mongoose.Schema({
  name: {
    type: String,
  },
  age: {
    type: Number,
  },
  email: {
    type: String,
  },
  gender: {
    type: String,
  },
});

module.exports = mongoose.model("User", user);
