import * as admin from 'firebase-admin'

var serviceAccount = require("./serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "binder-64501.appspot.com"
});

const firebaseAdmin = { admin, db: admin.firestore(), auth: admin.auth(), storage: admin.storage()};

export default firebaseAdmin