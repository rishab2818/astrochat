/*-----------------------------------------------------------------------
Revision - 001
Name: Rishab O
Date: 21 Feb 2024
Revision History:
  - Initial Version 
------------------------------------------------------------------------*/
/*-----------------------------------------------------------------------
Revision - 002
Name: Rishab O
Date: 21 Feb 2024
Revision History:
  - Added Logging 
------------------------------------------------------------------------*/
/*-----------------------------------------------------------------------
Revision - 003
Name: Rishab O
Date: 21 Feb 2024
Revision History:
  - New API added to get list of all users
------------------------------------------------------------------------*/
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const firebaseAdmin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const { registerUser, loginUser, sendMessage, getMessages,getuserlist } = require('./controllers/userController');

const app = express();

// Create logs directory if not exists
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Create a write stream (appending) for the log file
const logStream = fs.createWriteStream(path.join(logsDir, 'app.log'), { flags: 'a' });

// Log function
const log = (message, status = 200) => {
  const logMessage = `${new Date().toISOString()} - Status: ${status} - ${message}\n`;
  console.log(logMessage);
  logStream.write(logMessage);
};

// Parse JSON bodies
app.use(bodyParser.json());

// Firebase Admin SDK initialization
const serviceAccount = require('/home/lattech-dev1/Desktop/chatfcm/servicekey.json');
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount)
});

// MongoDB Connection
const db = mongoose.connection;
db.on('error', (err) => {
  log(`MongoDB connection error: ${err.message}`, 100);
});

mongoose.connect('mongodb+srv://prorishab:prorishab@cluster0.yywb5ef.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.catch(err => {
  log(`MongoDB connection error: ${err.message}`, 100);
});

// Routes
app.post('/register', (req, res) => {
  try {
    registerUser(req, res);
  } catch (error) {
    log(`Error in user registration: ${error.message}`, 200);
    res.status(500).send({ error: 'Internal server error' });
  }
});

app.post('/login', (req, res) => {
  try {
    loginUser(req, res);
  } catch (error) {
    log(`Error in user login: ${error.message}`, 300);
    res.status(500).send({ error: 'Internal server error' });
  }
});

app.post('/send-message', (req, res) => {
  try {
    sendMessage(req, res);
  } catch (error) {
    log(`Error in sending message: ${error.message}`, 400);
    res.status(500).send({ error: 'Internal server error' });
  }
});


app.get('/messages', (req, res) => {
  try {
    getMessages(req, res);
  } catch (error) {
    log(`Error in retrieving messages: ${error.message}`, 500);
    res.status(500).send({ error: 'Internal server error' });
  }
});
app.get('/userlist', (req, res) => {
  try {
    getuserlist(req, res);
  } catch (error) {
    log(`Error in retrieving messages: ${error.message}`, 600);
    res.status(500).send({ error: 'Internal server error' });
  }
});
app.post('/updatefcm', (req, res) => {
  try {
    updateFCMToken(req, res);
  } catch (error) {
    log(`Error in sending message: ${error.message}`, 700);
    res.status(500).send({ error: 'Internal server error' });
  }
});
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  log(`Server is running on port ${PORT}`);
});
