const Sequelize = require('sequelize');
const db = require('../db');

const Player = db.define('player', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  age: {
    type: Sequelize.INTEGER,
  },
  rotoworld_id: {
    type: Sequelize.STRING,
  },
  sportradar_id: {
    type: Sequelize.STRING,
  },
  depth_chart_order: {
    type: Sequelize.INTEGER,
  },
  number: {
    type: Sequelize.INTEGER,
  },
  high_school: {
    type: Sequelize.STRING,
  },
  weight: {
    type: Sequelize.STRING,
  },
  height: {
    type: Sequelize.STRING,
  },
  last_name: {
    type: Sequelize.STRING,
  },
  search_last_name: {
    type: Sequelize.STRING,
  },
  full_name: {
    type: Sequelize.STRING,
  },
  player_id: {
    type: Sequelize.STRING,
  },
  status: {
    type: Sequelize.STRING,
  },
  hashtag: {
    type: Sequelize.STRING,
  },
  gsis_id: {
    type: Sequelize.STRING,
  },
  birth_city: {
    type: Sequelize.STRING,
  },
  birth_country: {
    type: Sequelize.STRING,
  },
  practice_participation: {
    type: Sequelize.STRING,
  },
  position: {
    type: Sequelize.STRING,
  },
  birth_date: {
    type: Sequelize.STRING,
  },
  fantasy_positions: {
    type: Sequelize.JSON,
  },
  injury_body_part: {
    type: Sequelize.STRING,
  },
  depth_chart_position: {
    type: Sequelize.STRING,
  },
  sport: {
    type: Sequelize.STRING,
  },
  first_name: {
    type: Sequelize.STRING,
  },
  espn_id: {
    type: Sequelize.STRING,
  },
  fantasy_data_id: {
    type: Sequelize.STRING,
  },
  years_exp: {
    type: Sequelize.INTEGER,
  },
  rotowire_id: {
    type: Sequelize.STRING,
  },
  pandascore_id: {
    type: Sequelize.STRING,
  },
  stats_id: {
    type: Sequelize.STRING,
  },
  swish_id: {
    type: Sequelize.STRING,
  },
  college: {
    type: Sequelize.STRING,
  },
  search_rank: {
    type: Sequelize.INTEGER,
  },
  birth_state: {
    type: Sequelize.STRING,
  },
  team: {
    type: Sequelize.STRING,
  },
  search_first_name: {
    type: Sequelize.STRING,
  },
  search_full_name: {
    type: Sequelize.STRING,
  },
  yahoo_id: {
    type: Sequelize.STRING,
  },
  injury_start_date: {
    type: Sequelize.STRING,
  },
  news_updated: {
    type: Sequelize.STRING,
  },
  injury_status: {
    type: Sequelize.STRING,
  },
  active: {
    type: Sequelize.BOOLEAN,
  },
  injury_notes: {
    type: Sequelize.STRING,
  },
  practice_description: {
    type: Sequelize.STRING,
  },
  personal_tier: {
    type: Sequelize.INTEGER,
  },
  ringer_tier: {
    type: Sequelize.INTEGER,
  },
  fp_tier: {
    type: Sequelize.INTEGER,
  },
  personal_pos_tier: {
    type: Sequelize.INTEGER,
  },
  ringer_pos_tier: {
    type: Sequelize.INTEGER,
  },
  fp_pos_tier: {
    type: Sequelize.INTEGER,
  },
  bye: {
    type: Sequelize.INTEGER,
  },
  adp: {
    type: Sequelize.INTEGER,
  },
  ecr: {
    type: Sequelize.INTEGER,
  },
  personal_ranking: {
    type: Sequelize.INTEGER,
  },
  ringer_ranking: {
    type: Sequelize.INTEGER,
  },
  fp_ranking: {
    type: Sequelize.INTEGER,
  },
  personal_pos_ranking: {
    type: Sequelize.INTEGER,
  },
  ringer_pos_ranking: {
    type: Sequelize.INTEGER,
  },
  fp_pos_ranking: {
    type: Sequelize.INTEGER,
  },
});

module.exports = Player;
