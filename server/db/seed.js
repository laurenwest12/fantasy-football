const db = require('./db');
const { Pick, Player } = require('./models/index');

const { ringerData } = require('../data/theringer');

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

const insertRingerData = async () => {
  const errors = [];
  const { qbs, rbs, tes, wrs } = ringerData;

  const insert = async (data, type) => {
    for (let i = 0; i < data.length; ++i) {
      let { name, pos, rank, tier } = data[i];
      name = name.replace(' Jr.', '');
      name = name.replace(' III', '');

      const pos_ranking = pos.replace(type, '');

      try {
        const player = await Player.findOne({
          where: {
            full_name: name,
          },
        });

        await player.update({
          ringer_pos_tier: tier,
          ringer_ranking: rank,
          ringer_pos_ranking: pos_ranking,
        });
      } catch (err) {
        errors.push({
          name,
          err: err?.message,
        });
      }
    }
  };

  await insert(qbs, 'qb');
  await insert(rbs, 'rb');
  await insert(tes, 'te');
  await insert(wrs, 'wr');

  console.log(errors);
};

const syncAndSeed = async () => {
  await db.authenticate();
  await insertRingerData();
  // await db.sync({ force: true });
  // await insertPlayers();
  // await insertPicks();
};

module.exports = {
  syncAndSeed,
};
