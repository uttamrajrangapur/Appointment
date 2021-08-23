const admin = require('firebase-admin');
const serviceAccount = require('./keys.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();