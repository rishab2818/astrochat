/*
Author: Rishab O
Date: 21 Feb 2024
Revision: 001
Revision History:
  - Initial Version  
*/
/*-----------------------------------------------------------------------
Revision - 002
Name: Rishab O
Date: 21 Feb 2024
Revision History:
  - Added isAdmin boolean parameter to mark admin login
------------------------------------------------------------------------*/
const mongoose = require('mongoose');

// Define the schema for the User model
const userSchema = new mongoose.Schema({
  name: String,                     // User's name
  userId: { type: String, unique: true }, // User ID (unique)
  phoneNumber: String,              // User's phone number
  email: String,                    // User's email
  password: String,                 // User's password
  fcmToken: String,                 // FCM token for push notifications
  isAdmin: { type: Boolean, default: false } // Indicates if the user is an admin
});

// Create a model from the schema
const User = mongoose.model('User', userSchema);

// Export the User model
module.exports = User;
