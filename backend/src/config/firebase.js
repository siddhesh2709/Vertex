const admin = require('firebase-admin');
const path = require('path');

// To use Firebase Admin locally, you need a serviceAccountKey.json
// Download it from: Firebase Console -> Project Settings -> Service Accounts -> Generate new private key
const serviceAccountPath = path.join(__dirname, '../../serviceAccountKey.json');

try {
    const serviceAccount = require(serviceAccountPath);
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    console.log('✅ Firebase Admin initialized with Service Account.');
} catch (error) {
    console.warn('⚠️ Firebase Admin serviceAccountKey.json not found. Backend auth verification may fail.');
    // Fallback for minimal initialization if possible (though limited)
    admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID
    });
}

module.exports = admin;
