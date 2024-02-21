/*
Author: Rishab O
Date: 21 Feb 2024
Revision: 001
Revision History:
  - Initial Version 
*/
const mongoose = require('mongoose');

// Define the schema for the Message model
const messageSchema = new mongoose.Schema({
  senderUserId: String,       // ID of the user sending the message
  receiverUserId: String,     // ID of the user receiving the message
  message: String             // Content of the message
});

// Create a model from the schema
const Message = mongoose.model('Message', messageSchema);

// Export the Message model
module.exports = Message;
