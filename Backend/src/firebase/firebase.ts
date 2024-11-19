import * as admin from 'firebase-admin'

require("dotenv").config();
if (!process.env.FIREBASE_CREDENTIALS) {
  throw new Error("FIREBASE_CREDENTIALS environment variable is not set");
}

const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "binder-64501.appspot.com"
});

const firebaseAdmin = { admin, db: admin.firestore(), auth: admin.auth(), storage: admin.storage()};

export default firebaseAdmin