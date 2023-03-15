const Pick = require('./Pick');
const Player = require('./Player');

Player.hasMany(Pick);
Pick.belongsTo(Player);

module.exports = {
  Player,
  Pick,
};
