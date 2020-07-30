import admin from 'firebase-admin';
import serviceAccount from '../../serviceAccountKey.json';

class _FirebaseAdmin {
  constructor() {}
  init() {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: 'https://playhard-2c8eb.firebaseio.com',
    });
  }
  admin() {
    return admin;
  }
}

const FirebaseAdmin = new _FirebaseAdmin();

export default FirebaseAdmin;
