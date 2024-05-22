const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

const verifyToken = promisify(jwt.verify);

module.exports = { signToken, verifyToken };
