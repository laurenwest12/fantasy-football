const { Player } = require('../db/models/index');
const { Op } = require('sequelize');

const playerController = {
  getAllPlayers: async (req, res) => {
    try {
      const players = await Player.findAll({
        where: {
          avg_ranking: { [Op.ne]: 0 },
        },
        order: [['avg_ranking', 'ASC']],
      });
      res.json(players);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  getPlayersByPosition: async (req, res) => {
    try {
      const players = await Player.findAll({
        where: {
          position: req.params.position.toUpperCase(),
          fp_ranking: { [Op.ne]: 0 },
        },
        order: [['fp_ranking', 'ASC']],
      });
      res.json(players);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  getPlayerById: async (req, res) => {
    try {
      const { id } = req.params;
      const player = await Player.findByPk(id);
      if (!player) {
        return res.status(404).json({ error: 'Player not found' });
      }
      res.json(player);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

module.exports = playerController;
