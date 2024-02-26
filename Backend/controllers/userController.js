/*
Author: Rishab O
Date: 21 Feb 2024
Revision: 001
Revision History:
  - Initial Version  
/*-----------------------------------------------------------------------
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
  - Code revised for login and register due to addition of isadmin field
------------------------------------------------------------------------*/
/*-----------------------------------------------------------------------
Revision - 004
Name: Rishab O
Date: 21 Feb 2024
Revision History:
  - New API added to get list of all users
------------------------------------------------------------------------*/
// Import necessary models and Firebase Admin SDK
const User = require('../models/User');
const Message = require('../models/Message');
const firebaseAdmin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Create logs directory if not exists
const logsDir = path.join(__dirname, '..', 'logs');
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

// Register User
exports.registerUser = async (req, res) => {
  try {
    // Extract user details from request body 
    const { name, userId, phoneNumber, email, password, isAdmin } = req.body;
    console.log("request body", req.body);

    // Create a new user instance 
    const newUser = new User({ name, userId, phoneNumber, email, password, isAdmin, fcmToken: null });

    // Save the user details to the database
    await newUser.save();

    // Send a success response
    res.status(201).send({ message: 'User registered successfully' });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.userId === 1) {
      // Log duplicate userId error
      log(`Duplicate userId error: User with userId '${req.body.userId}' already exists`, 201);

      // Send an error response indicating duplicate userId
      res.status(400).send({ error: 'User with this userId already exists' });
    } else {
      // Log other errors
      log(`Error in user registration: ${error.message} - Request Body: ${JSON.stringify(req.body)}`, 201);
      
      // Send an error response
      res.status(500).send({ error: 'Internal server error' });
    }
  }
};



// Login User
exports.loginUser = async (req, res) => {
  try {
    // Extract user ID and password from request body
    const { userId, password } = req.body;

    // Find the user in the database based on user ID and password
    const user = await User.findOne({ userId, password });

    // If user not found, send a 404 error response
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    // Check if the user is an admin
    const isAdmin = user.isAdmin || false;

    // Send FCM token along with login response and isAdmin status
    res.status(200).send({ message: 'Login successful', isAdmin });
  } catch (error) {
    // Log the error
    log(`Error in user login: ${error.message} - Request Body: ${JSON.stringify(req.body)}`, 301);

    // Send an error response
    res.status(500).send({ error: 'Internal server error' });
  }
};

// Send Message
exports.sendMessage = async (req, res) => {
  try {
    // Extract sender ID, receiver ID, and message from request body
    const { senderUserId, receiverUserId, message } = req.body;

    // Create a new message instance
    const newMessage = new Message({ senderUserId, receiverUserId, message });

    // Retrieve receiver's FCM token from the database
    const receiverUser = await User.findOne({ userId: receiverUserId });
    const receiverFcmToken = receiverUser.fcmToken;

    // Prepare notification payload for FCM
    const notificationPayload = {
      notification: {
        title: `New Message: ${message}`,
        body: `You have received a new message from ${senderUserId}`
      }
    };

    // Send notification to receiver using FCM
    await firebaseAdmin.messaging().sendToDevice(receiverFcmToken, notificationPayload);

    // Save the message in the database
    await newMessage.save();

    // Send a success response
    res.status(201).send({ message: 'Message sent successfully' });
  } catch (error) {
    // Log the error
    log(`Error in sending message: ${error.message} - Request Body: ${JSON.stringify(req.body)}`, 401);

    // Send an error response
    res.status(500).send({ error: 'Internal server error' });
  }
};

// Get Messages
exports.getMessages = async (req, res) => {
  try {
    // Extract sender ID, receiver ID, page, and limit from query parameters
    const { senderUserId, receiverUserId, page = 1, limit = 20 } = req.query;

    // Calculate skip count based on page and limit
    const skipCount = (page - 1) * limit;

    // Retrieve messages from the database based on sender and receiver IDs with pagination
    const messages = await Message.find({ senderUserId, receiverUserId })
      .skip(skipCount)
      .limit(parseInt(limit));

    // Send retrieved messages as a response
    res.status(200).send(messages);
  } catch (error) {
    // Log the error
    log(`Error in retrieving messages: ${error.message} - Request query: ${JSON.stringify(req.query)}`, 501);

    // Send an error response
    res.status(500).send({ error: 'Internal server error' });
  }
};
// API to get user list
exports.getuserlist = async (req, res) => {
  try {
    const { userId } = req.query;
    console.log("userID",userId)

    // Find the user in the database based on user ID
    const user = await User.findOne({ userId });
    console.log("userID",user)
    // Check if the user exists
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    // Check if the user is an admin
    if (user.isAdmin) {
      // If the user is an admin, return all user IDs
      const allUsers = await User.find({}, 'userId');
      const userIds = allUsers.map(user => user.userId);
      return res.status(200).send({ userIds });
    } else {
      // If the user is not an admin, return only admin user IDs
      const adminUsers = await User.find({ isAdmin: true }, 'userId');
      const adminUserIds = adminUsers.map(user => user.userId);
      return res.status(200).send({ adminUserIds });
    }
  } catch (error) {
    // Log the error
    log(`Error in retrieving user list: ${error.message} - Request Body: ${JSON.stringify(req.query)}`, 601);

    // Send an error response
    res.status(500).send({ error: 'Internal server error' });
  }
};

exports.updateFCMToken = async (req, res) => {
  try {
    // Extract user ID and FCM token from request body
    const { userId, fcmToken } = req.body;

    // Find the user in the database based on user ID
    const user = await User.findOne({ userId });

    // Check if the user exists
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    // Update the FCM token for the user
    user.fcmToken = fcmToken;
    await user.save();

    // Send a success response
    res.status(200).send({ message: 'FCM token updated successfully' });
  } catch (error) {
    // Log the error
    console.error(`Error in updating FCM token: ${error.message}`);

    // Send an error response
    res.status(500).send({ error: 'Internal server error' });
  }
};