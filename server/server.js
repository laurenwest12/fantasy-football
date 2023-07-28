require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const port = process.env.PORT || 3001;

// Functions
const { syncAndSeed } = require('./db/seed');

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
const playersRoutes = require('./routes/players');

app.use('/api/players', playersRoutes);

app.listen(port, async () => {
  console.log(`Server running on port ${port}`);
  await syncAndSeed();
});
