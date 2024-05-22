const { Sequelize } = require('sequelize');

const config = require('../config/app.config');

const sequelize = new Sequelize(
  config.appName,
  config.appDbUser,
  config.appDbPassword,
  {
    host: config.appDbHost,
    dialect: 'postgres',
  }
);

module.exports = sequelize;
