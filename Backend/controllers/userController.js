/*
Revision - 001
Name: Rishab O
Date: 21 Feb 2024
Revision History:
  - Initial Version 
*/

// Import necessary models and Firebase Admin SDK
const User = require('../models/User');
const Message = require('../models/Message');
const firebaseAdmin = require('firebase-admin');

// Register User
exports.registerUser = async (req, res) => {
  try {
    // Extract user details from request body
    const { name, userId, phoneNumber, email, password, fcmToken } = req.body;

    // Create a new user instance
    const newUser = new User({ name, userId, phoneNumber, email, password, fcmToken });

    // Save the user details to the database
    await newUser.save();

    // Send a success response
    res.status(201).send({ message: 'User registered successfully' });
  } catch (error) {
    // Handle errors and send an error response
    console.error(error);
    res.status(500).send({ error: 'Internal server error' });
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

    // Send FCM token along with login response
    res.status(200).send({ message: 'Login successful', fcmToken: user.fcmToken });
  } catch (error) {
    // Handle errors and send an error response
    console.error(error);
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
    // Handle errors and send an error response
    console.error(error);
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
    // Handle errors and send an error response
    console.error(error);
    res.status(500).send({ error: 'Internal server error' });
  }
};
