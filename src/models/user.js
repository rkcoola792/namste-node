const mongoose = require("mongoose");

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
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", user);
