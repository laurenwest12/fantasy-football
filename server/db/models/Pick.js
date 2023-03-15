const Sequelize = require('sequelize');
const db = require('../db');

const Pick = db.define('pick', {
  uid: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  round: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  roster_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  picked_by: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  pick_no: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  is_keeper: {
    type: Sequelize.BOOLEAN,
  },
  draft_slot: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  draft_id: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Pick;
