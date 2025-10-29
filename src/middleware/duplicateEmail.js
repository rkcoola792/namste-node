const User = require("../models/user");
const checkEmailExists = async (req, res, next) => {
  try {
    const userExists = await User.findOne({ email: req.body.email });

    if (userExists) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // If email doesn't exist, proceed to next middleware/controller
    next();
  } catch (error) {
    return res.status(500).json({ error: "Server error checking email" });
  }
};
module.exports = checkEmailExists;
