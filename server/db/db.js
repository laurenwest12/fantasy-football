const Sequelize = require('sequelize');

const db = new Sequelize(
  process.env.DB,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: 'localhost',
    dialect: 'postgres',
    logging: false,
  }
);

module.exports = db;
