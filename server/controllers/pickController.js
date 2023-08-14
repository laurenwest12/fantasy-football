const { Player, Pick, Team } = require('../db/models/index');
const { Op } = require('sequelize');

const pickController = {
  getAllPicks: async (req, res) => {
    try {
      const picks = await Pick.findAll({
        order: [['pick_no', 'ASC']],
        include: [Player],
      });
      res.json(picks);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

module.exports = pickController;
