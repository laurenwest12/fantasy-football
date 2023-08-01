const Pick = require('./Pick');
const Player = require('./Player');
const Team = require('./Team');

Player.hasMany(Pick);
Pick.belongsTo(Player);

Team.hasMany(Player);
Player.belongsTo(Team);

module.exports = {
  Player,
  Pick,
  Team,
};
