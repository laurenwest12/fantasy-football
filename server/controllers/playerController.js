const { Player, Pick } = require('../db/models/index');
const { Op } = require('sequelize');

const playerController = {
  getAllPlayers: async (req, res) => {
    let positions = req.query?.positions;
    let sort = req.query?.sort;
    try {
      let where = {
        avg_ranking: { [Op.ne]: 0 },
      };

      let order = [['avg_ranking', 'ASC']];
      if (sort) order[0] = sort.split(' ');

      if (positions)
        where['position'] = {
          [Op.in]: positions.split(','),
        };

      const players = await Player.findAll({
        where,
        order,
        include: Pick,
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
          position: {
            [Op.in]: req.query.positions.split(','),
          },
          avg_ranking: { [Op.ne]: 0 },
        },
        order: [['avg_ranking', 'ASC']],
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
