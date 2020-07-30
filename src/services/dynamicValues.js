import FirebaseAdmin from './firebaseAdmin';

const admin = FirebaseAdmin.admin();

class _DynamicValues {
  constructor() {
    this.FB_CODE = null;
  }

  init() {
    const db = admin.database();
    const ref = db.ref('FB_CODE');
    const bindSetFBCode = (value) => this.setFBCode(value);
    ref.on('value', function(snapshot) {
      bindSetFBCode(snapshot.val());
    });
  }

  setFBCode(value) {
    this.FB_CODE = value;
  }
}

const DynamicValues = new _DynamicValues();

export default DynamicValues;
