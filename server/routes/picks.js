const express = require('express');
const router = express.Router();
const pickController = require('../controllers/pickController');

router.get('/', pickController.getAllPicks);

module.exports = router;
