const fs = require('fs');
const { Op } = require('sequelize');
const Papa = require('papaparse');
const { Player } = require('./models/index');

const getAllPlayers = async () => {
  const res = await Player.findAll({
    where: {
      bye: { [Op.ne]: 0 },
    },
  });
  const players = res.map(({ dataValues }) => dataValues);
  const csv = Papa.unparse(players);
  fs.writeFileSync('FantasyPlayers.csv', csv);
};

module.exports = {
  getAllPlayers,
};
