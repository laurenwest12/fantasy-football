require('dotenv').config();
const express = require('express');
const app = express();

const port = process.env.PORT || 3001;

const { syncAndSeed } = require('./db/seed');

app.listen(port, async () => {
  console.log(`Server running on port ${port}`);
  await syncAndSeed();
});
