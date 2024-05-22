const axios = require('axios');

const get = async (url) => {
  const result = await axios.get(url);

  return result.data;
};

const post = async (url, data) => {
  const result = await axios.post(url, data);

  return result.data;
};

module.exports = {
  get,
  post,
};
