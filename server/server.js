require('dotenv').config();
const express = require('express');
const app = express();

const port = process.env.PORT || 3001;

const { syncAndSeed } = require('./db/seed');
const { getAllPlayers } = require('./db/fetch');
const { getPlayers } = require('./sleeper');

app.listen(port, async () => {
  console.log(`Server running on port ${port}`);
  await syncAndSeed();
  //const players = await getAllPlayers();
  //console.log(players);
});
