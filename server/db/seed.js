const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');
const { Op } = require('sequelize');

const db = require('./db');
const { Pick, Player, Team } = require('./models/index');

const { ringerData, ringerDataWithTotalTiers } = require('../data/theringer');

const { getDraftPicks, getPlayers } = require('../sleeper');

const insertPlayers = async () => {
  const players = await getPlayers();
  for (let i = 0; i < players.length; ++i) {
    const player = players[i];
    const { full_name, depth_chart_order, depth_chart_position } = player;
    let updateObj = {};
    let position;

    switch (depth_chart_position) {
      case 'QB':
        position = 'qb';
        break;
      case 'RB':
        position = 'rb';
        break;
      case 'LWR':
        position = 'wr1';
        break;
      case 'RWR':
        position = 'wr2';
        break;
      case 'SWR':
        position = 'wr3';
        break;
      case 'TE':
        position = 'te';
        break;
    }

    if (player.team) {
      const existingTeam = await Team.findOne({
        where: {
          team: player.team,
        },
      });

      if (existingTeam) {
        const currentPosition = existingTeam.dataValues[position];
        updateObj[position] = {
          ...currentPosition,
          [full_name]: depth_chart_order,
        };
        await existingTeam.update(updateObj);
        await Player.create({
          ...player,
          teamName: player.team,
          teamId: existingTeam.dataValues.id,
        });
      } else {
        updateObj[position] = {
          [full_name]: depth_chart_order,
        };
        const newTeam = await Team.create({
          team: player.team,
        });
        await newTeam.update(updateObj);
        await Player.create({
          ...player,
          teamName: player.team,
          teamId: newTeam.dataValues.id,
        });
      }
    } else {
      await Player.create(player);
    }
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

const insertPicksWithDelay = async (io) => {
  const picks = await getDraftPicks(process.env.DRAFT_ID);
  for (let pick of picks) {
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

    const newPlayer = await Player.findOne({
      where: {
        id: player_id,
      },
      include: Pick,
    });

    io.emit('updatePlayer', newPlayer.toJSON());
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
};

const insertRingerData = async () => {
  const errors = [];
  const { qbs, rbs, tes, wrs } = ringerDataWithTotalTiers();

  const insert = async (data, type) => {
    for (let i = 0; i < data.length; ++i) {
      let { name, pos, rank, tier, total_tier } = data[i];
      name = name.replace(' Jr.', '');
      name = name.replace(' III', '');

      try {
        const player = await Player.findOne({
          where: {
            full_name: name,
          },
        });

        await player.update({
          ringer_pos_tier: tier,
          ringer_tier: total_tier,
          ringer_ranking: rank,
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
          });

          if (ADP && ADP !== '#VALUE!') await player.update({ fp_adp: ADP });
          if (BYE !== '-' && BYE) await player.update({ bye: BYE });
        } else if (player) {
          await player.update({
            fp_pos_tier: TIERS,
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

const insertOtherRankingData = async () => {
  const files = fs
    .readdirSync(path.resolve(__dirname, '../data'))
    .filter((file) => file.indexOf('Fantasy Rankings') !== -1);

  const filename = files[0];
  const csv = fs.readFileSync(
    path.resolve(__dirname, `../data/${filename}`),
    'utf8'
  );
  const { data } = Papa.parse(csv, {
    header: true,
  });

  for (let row of data) {
    let { nflName, NFL, Yahoo, ESPNppr } = row;

    nflName = nflName.replace(' Jr.', '');
    nflName = nflName.replace(' III', '');
    nflName = nflName.replace(' II', '');
    nflName = nflName.replace(' D/ST', '');
    nflName = nflName.replace(' IR', '');
    nflName = nflName.replace(' Sr.', '');

    const player = await Player.findOne({
      where: {
        full_name: {
          [Op.like]: '%' + nflName + '%',
        },
      },
    });

    if (player) {
      let updateObj = {};
      if (NFL && NFL !== '#N/A') updateObj.nfl_ranking = NFL.replace(',', '');
      if (Yahoo && Yahoo !== '#N/A')
        updateObj.yahoo_ranking = Yahoo.replace(',', '');
      if (ESPNppr && ESPNppr !== '#N/A')
        updateObj.espn_ranking = ESPNppr.replace(',', '');
      await player.update(updateObj);
    }
  }
};

const insertADPData = async () => {
  const files = fs
    .readdirSync(path.resolve(__dirname, '../data'))
    .filter((file) => file.indexOf('ADP') !== -1);

  const filename = files[0];
  const csv = fs.readFileSync(
    path.resolve(__dirname, `../data/${filename}`),
    'utf8'
  );
  const { data } = Papa.parse(csv, {
    header: true,
  });

  for (let row of data) {
    let { nflName, NFL, Yahoo, ESPN, SleepHalf, FPHalf } = row;

    nflName = nflName.replace(' Jr.', '');
    nflName = nflName.replace(' III', '');
    nflName = nflName.replace(' II', '');
    nflName = nflName.replace(' D/ST', '');
    nflName = nflName.replace(' IR', '');
    nflName = nflName.replace(' Sr.', '');

    const player = await Player.findOne({
      where: {
        full_name: {
          [Op.like]: '%' + nflName + '%',
        },
      },
    });

    if (player) {
      let updateObj = {};
      if (NFL && NFL !== '#N/A') updateObj.nfl_adp = parseFloat(NFL);
      if (Yahoo && Yahoo !== '#N/A') updateObj.yahoo_adp = parseFloat(Yahoo);
      if (ESPN && ESPN !== '#N/A') updateObj.espn_adp = parseFloat(ESPN);
      if (SleepHalf && SleepHalf !== '#N/A')
        updateObj.sleeper_adp = parseFloat(SleepHalf);
      if (FPHalf && FPHalf !== '#N/A') updateObj.fp_adp = parseFloat(FPHalf);
      await player.update(updateObj);
    }
  }
};

const calculateAvg = async () => {
  const players = await Player.findAll();
  for (let player of players) {
    let total_ranking = 0;
    let num_ranking = 0;
    let total_adp = 0;
    let num_adp = 0;
    let total_tier = 0;
    let total_pos_tier = 0;
    let num_total_tier = 0;
    let num_pos_tier = 0;

    const {
      personal_ranking,
      espn_ranking,
      fp_ranking,
      nfl_ranking,
      ringer_ranking,
      yahoo_ranking,
      espn_adp,
      fp_adp,
      nfl_adp,
      sleeper_adp,
      yahoo_adp,
      personal_tier,
      fp_tier,
      ringer_tier,
      personal_pos_tier,
      fp_pos_tier,
      ringer_pos_tier,
    } = player;

    total_ranking +=
      personal_ranking +
      ringer_ranking +
      fp_ranking +
      espn_ranking +
      nfl_ranking +
      yahoo_ranking;

    total_adp +=
      parseFloat(espn_adp) +
      parseFloat(fp_adp) +
      parseFloat(nfl_adp) +
      parseFloat(sleeper_adp) +
      parseFloat(yahoo_adp);

    total_tier += personal_tier + fp_tier + ringer_tier;
    total_pos_tier += personal_pos_tier + fp_pos_tier + ringer_pos_tier;

    if (personal_ranking) num_ranking++;
    if (ringer_ranking) num_ranking++;
    if (fp_ranking) num_ranking++;
    if (espn_ranking) num_ranking++;
    if (nfl_ranking) num_ranking++;
    if (yahoo_ranking) num_ranking++;

    if (espn_adp) num_adp++;
    if (fp_adp) num_adp++;
    if (nfl_adp) num_adp++;
    if (sleeper_adp) num_adp++;
    if (yahoo_adp) num_adp++;

    if (personal_tier) num_total_tier++;
    if (fp_tier) num_total_tier++;
    if (ringer_tier) num_total_tier++;

    if (personal_pos_tier) num_pos_tier++;
    if (fp_pos_tier) num_pos_tier++;
    if (ringer_pos_tier) num_pos_tier++;

    let avg_ranking = Math.round(total_ranking / num_ranking);
    let avg_adp = total_adp / num_adp;
    let avg_tier = total_tier / num_total_tier;
    let avg_pos_tier = total_pos_tier / num_pos_tier;

    if (!avg_ranking) avg_ranking = 0;
    if (!avg_adp) avg_adp = 0;
    if (!avg_tier) avg_tier = null;
    if (!avg_pos_tier) avg_pos_tier = null;

    player.update({
      avg_ranking: avg_ranking,
      avg_adp: avg_adp,
      avg_tier: Math.round(avg_tier),
      avg_pos_tier: Math.round(avg_pos_tier),
    });
  }
};

const syncAndSeed = async () => {
  await db.authenticate();
  // await db.sync({ alter: true });
  // await insertPlayers();
  // console.log('Players inserted');
  // // await insertPicks();
  // await insertFPData();
  // console.log('FP inserted');
  // await insertRingerData();
  // console.log('Ringer inserted');
  // await insertOtherRankingData();
  // console.log('Other inserted');
  // await insertADPData();
  // console.log('ADP inserted');
  // await calculateAvg();
  // console.log('Finished seeding');
};

module.exports = {
  syncAndSeed,
  insertPicksWithDelay,
};
