const axios = require('axios');

const getUserDrafts = async () => {
  try {
    const { data } = await axios.get(
      `https://api.sleeper.app/v1/user/${process.env.USER_ID}/drafts/nfl/2022`
    );
    return data;
  } catch (err) {
    return {
      statusCode: 404,
      err: err?.message,
    };
  }
};

const getUserDraftByLeagueName = async (league) => {
  try {
    const { data } = await axios.get(
      `https://api.sleeper.app/v1/user/${process.env.USER_ID}/drafts/nfl/2022`
    );
    return data.filter(({ metadata }) => metadata.name === league);
  } catch (err) {
    return {
      statusCode: 404,
      err: err?.message,
    };
  }
};

const getDraftPicks = async (leagueId) => {
  try {
    const { data } = await axios.get(
      `https://api.sleeper.app/v1/draft/${leagueId}/picks`
    );
    return data;
  } catch (err) {
    return {
      statusCode: err?.response?.status || 404,
      err: err?.message,
    };
  }
};

const getPlayers = async () => {
  const { data } = await axios.get(`https://api.sleeper.app/v1/players/nfl`);
  const players = [];
  for (let playerId in data) {
    let playerData = data[playerId];
    const { position, active } = playerData;
    if (position === 'DEF') {
      playerData[
        'full_name'
      ] = `${playerData.first_name} ${playerData.last_name}`;
    }
    if (process.env.POSITIONS.includes(position) && active) {
      delete playerData.metadata;
      players.push({
        id: playerId,
        ...playerData,
        // personal_tier: 0,
        // ringer_tier: 0,
        // fp_tier: 0,
        // bs_tier: 0,
        // avg_tier: 0,
        // personal_pos_tier: 0,
        // ringer_pos_tier: 0,
        // fp_pos_tier: 0,
        // bs_pos_tier: 0,
        // avg_pos_tier: 0,
        // bye: 0,
        // personal_ranking: 0,
        // ringer_ranking: 0,
        // fp_ranking: 0,
        // bs_ranking: 0,
        // avg_ranking: 0,
        //personal_pos_ranking: 0,
        //ringer_pos_ranking: 0,
        //fp_pos_ranking: 0,
        //bs_pos_ranking: 0,
        //avg_pos_ranking: 0,
        // fp_adp: 0,
        // bs_adp: 0,
        // fp_ecr: 0,
        // bs_ecr: 0,
        // avg_adp: 0,
        // avg_ecr: 0,
      });
    }
  }
  return players;
};

module.exports = {
  getUserDrafts,
  getUserDraftByLeagueName,
  getDraftPicks,
  getPlayers,
};
