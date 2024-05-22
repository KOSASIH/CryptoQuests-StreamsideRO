const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Player = sequelize.define(
  'Player',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    piAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    piBalance: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Player;
