const jwt = require("jsonwebtoken");
const secretKey = "abdo";
const generateToken = (id) => {
  return jwt.sign({ id }, secretKey, {
    expiresIn: "60d",
  });
};

const decodeToken = (token) => {
  return jwt.verify(token, secretKey);
};

module.exports = { generateToken, decodeToken };
