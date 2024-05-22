const crypto = require('crypto');

const generateHash = (data) => {
  const hash = crypto.createHash('sha256');
  hash.update(data);
  return hash.digest('hex');
};

const verifyHash = (data, hash) => {
  const hashToVerify = crypto.createHash('sha256');
  hashToVerify.update(data);
  return hashToVerify.digest('hex') === hash;
};

module.exports = {
  generateHash,
  verifyHash,
};
