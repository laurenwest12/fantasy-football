require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');

const port = process.env.PORT || 3001;

const app = express();
const server = http.createServer(app);

// Function to create and return the WebSocket server instance
const createSocketServer = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: 'http://localhost:3000', // Replace with your frontend URL
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // WebSocket server logic
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Handle client disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};

// Functions
const { syncAndSeed, insertPicksWithDelay } = require('./db/seed');

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
const playersRoutes = require('./routes/players');
const pickRoutes = require('./routes/picks');

app.use('/api/players', playersRoutes);
app.use('/api/picks', pickRoutes);

const io = createSocketServer(server);

app.get('/insert-picks', async (req, res) => {
  await insertPicksWithDelay(io);
  res.send('Picks inserted');
});

server.listen(port, async () => {
  console.log(`Server running on port ${port}`);
  await syncAndSeed();
});
