const bcrypt = require("bcrypt");

const createHash = (password) => {
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const encryptedPassword = bcrypt.hashSync(password, salt);
  return encryptedPassword;
};

const compareHash = (password, hash) => {
  return bcrypt.compareSync(password, hash);
};
module.exports = { createHash, compareHash };
