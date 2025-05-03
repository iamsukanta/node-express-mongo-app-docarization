const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const http = require('http');
const debug = require('debug');
const morgan = require('morgan');

//Model
const User = require('./models/User');


dotenv.config();
const app = express();

app.use(morgan('combined'));
//Middleware
app.use(express.json())

//MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));


//App Routes
//Store users 
app.post('/users', async (req, res) => {
    const {email, name } = req.body;
    try {
        const newUser = new User({ name, email });
        await newUser.save();
        res.status(201).json({ message: 'User saved', user: newUser });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// GET all users
app.get('/users', async (req, res) => {
    try {
      const users = await User.find(); // Fetch all users
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
});


// GET all users
app.get('/users-list', async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});
  

// Start Server
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
server.listen(PORT);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof PORT === 'string'
    ? 'Pipe ' + PORT
    : 'Port ' + PORT;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
  console.log('Server Running on http://localhost:'+ PORT);
}