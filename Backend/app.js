/*
Revision - 001
Name: Rishab O
Date: 21 Feb 2024
Revision History:
  - Initial Version 
*/
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const firebaseAdmin = require('firebase-admin');
const { registerUser, loginUser, sendMessage, getMessages } = require('./controllers/userController');

const app = express();

// Parse JSON bodies
app.use(bodyParser.json());

// Firebase Admin SDK initialization
const serviceAccount = require('/home/lattech-dev1/Desktop/chatfcm/servicekey.json');
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount)
});

// MongoDB Connection
mongoose.connect('mongodb+srv://prorishab:prorishab@cluster0.yywb5ef.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Routes
app.post('/register', registerUser); // Endpoint for user registration
app.post('/login', loginUser);       // Endpoint for user login
app.post('/send-message', sendMessage); // Endpoint for sending messages
app.get('/messages', getMessages);   // Endpoint for retrieving messages

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
