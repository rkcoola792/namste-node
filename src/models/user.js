const mongoose = require("mongoose");
const { compareHash, createHash } = require("../utils/createHash");
const jwt = require("jsonwebtoken");
const user = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    age: {
      type: Number,
      min: 18,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: "Please enter a valid email",
      },
    },
    gender: {
      type: String,
      trim: true,
      lowercase: true,
      enum: {
        values: ["male", "female", "other"],
        message: "Gender must be male, female, or other",
      },
    },
    skills: {
      type: [String],
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

user.methods.getJWT = async function () {
  const user = this; //this will give the current logged in user object
  const token = await jwt.sign({ id: this._id }, "Rajeev@12345", {
    expiresIn: "1d",
  });
  return token;
};
user.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

user.methods.validatePassword = async function (passwordEntered) {
  const user = this;
  const isValidPassword = await compareHash(passwordEntered, user.password);
  return isValidPassword;
};

module.exports = mongoose.model("User", user);
