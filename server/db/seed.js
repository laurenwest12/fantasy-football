const db = require('./db');
const { Pick, Player } = require('./models/index');

const { getDraftPicks, getPlayers } = require('../sleeper');

const insertPlayers = async () => {
  const players = await getPlayers();
  for (let i = 0; i < players.length; ++i) {
    const player = players[i];
    await Player.create(player);
  }
};

const insertPicks = async () => {
  const picks = await getDraftPicks(process.env.DRAFT_ID);
  for (let i = 0; i < picks.length; ++i) {
    let pick = picks[i];
    const { player_id } = pick;
    const player = await Player.findOne({
      where: {
        id: player_id,
      },
    });

    const playerId = player.dataValues.id;

    pick = {
      ...pick,
      playerId,
    };

    await Pick.create(pick);
  }
};

const syncAndSeed = async () => {
  await db.authenticate();
  await db.sync({ force: true });
  await insertPlayers();
  await insertPicks();
};

module.exports = {
  syncAndSeed,
};
