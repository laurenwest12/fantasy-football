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
    const playerData = data[playerId];
    const { position, active } = playerData;
    if (process.env.POSITIONS.includes(position) && active) {
      delete playerData.metadata;
      players.push({
        id: playerId,
        ...playerData,
        personal_tier: 0,
        ringer_tier: 0,
        fp_tier: 0,
        personal_pos_tier: 0,
        ringer_pos_tier: 0,
        fp_pos_tier: 0,
        bye: 0,
        adp: 0,
        ecr: 0,
        personal_ranking: 0,
        ringer_ranking: 0,
        fp_ranking: 0,
        personal_pos_ranking: 0,
        ringer_pos_ranking: 0,
        fp_pos_ranking: 0,
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
