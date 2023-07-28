const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

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

const insertFPData = async () => {
  const files = fs
    .readdirSync(path.resolve(__dirname, '../data'))
    .filter((file) => file.indexOf('fp') !== -1);

  for (let i = 0; i < files.length; ++i) {
    const filename = files[i];
    const csv = fs.readFileSync(
      path.resolve(__dirname, `../data/${filename}`),
      'utf8'
    );
    const { data } = Papa.parse(csv, {
      header: true,
    });

    const playersNotFound = [];
    for (let j = 0; j < data.length; ++j) {
      const { RK, TIERS } = data[j];
      let NAME = data[j]['PLAYER NAME'];
      const BYE = data[j]['BYE WEEK'];

      NAME = NAME.replace(' Jr.', '');
      NAME = NAME.replace(' III', '');
      NAME = NAME.replace(' II', '');
      if (NAME.slice(NAME.length - 1) === 'V')
        NAME = NAME.substring(0, NAME.length - 2);

      const player = await Player.findOne({
        where: {
          full_name: NAME,
        },
      });

      try {
        if (filename.indexOf('Total') !== -1 && player) {
          const { ADP } = data[j];
          await player.update({
            fp_ranking: RK,
            fp_tier: TIERS,
            fp_ecr: RK,
          });

          if (ADP && ADP !== '#VALUE!') await player.update({ fp_adp: ADP });
          if (BYE !== '-' && BYE) await player.update({ bye: BYE });
        } else if (player) {
          await player.update({
            fp_pos_tier: TIERS,
            fp_pos_ranking: RK,
          });
        } else {
          playersNotFound.push({
            full_name: NAME,
            filename,
          });
        }
      } catch (err) {
        console.log(err?.message, NAME, TIERS, RK);
      }
    }
  }
};

const syncAndSeed = async () => {
  await db.authenticate();
  // await db.sync({ force: true });
  // await insertPlayers();
  // await insertPicks();
  await insertFPData();
  // await insertRingerData();
};

module.exports = {
  syncAndSeed,
};
