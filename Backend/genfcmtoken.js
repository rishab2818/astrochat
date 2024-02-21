// generateFCMToken.js
const admin = require('firebase-admin');

const serviceAccount = require('/home/lattech-dev1/Desktop/chatfcm/servicekey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Simulate user registration and generate FCM token
async function generateFCMToken() {
  try {
    const registrationToken = 'mock-fcm-token'; // Replace with actual FCM token from your device

    // Send registration token to Firebase Cloud Messaging service
    const response = await admin.messaging().subscribeToTopic(registrationToken, 'mock-topic');
    console.log('FCM token:', registrationToken);
  } catch (error) {
    console.error('Error generating FCM token:', error);
  }
}

generateFCMToken();
