const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');

router.get('/', playerController.getAllPlayers);
router.get('/position/:position', playerController.getPlayersByPosition);
router.get('/:id', playerController.getPlayerById);

module.exports = router;
