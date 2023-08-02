const Sequelize = require('sequelize');
const db = require('../db');

const Team = db.define('team', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  team: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  teamCity: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: '',
  },
  teamName: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: '',
  },
  qb: {
    type: Sequelize.JSON,
    allowNull: false,
    defaultValue: {},
  },
  rb: {
    type: Sequelize.JSON,
    allowNull: false,
    defaultValue: {},
  },
  wr1: {
    type: Sequelize.JSON,
    allowNull: false,
    defaultValue: {},
  },
  wr2: {
    type: Sequelize.JSON,
    allowNull: false,
    defaultValue: {},
  },
  wr3: {
    type: Sequelize.JSON,
    allowNull: false,
    defaultValue: {},
  },
  te: {
    type: Sequelize.JSON,
    allowNull: false,
    defaultValue: {},
  },
});

module.exports = Team;
