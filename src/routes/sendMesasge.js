import { Router } from 'express';
import {
  sendMessageWithAppState,
  sendMessageWithFBCode,
} from '../services/sendMessage';
import FirebaseAdmin from '../services/firebaseAdmin';
import NotificationService from '../services/notificationService';

const admin = FirebaseAdmin.admin();

const routes = Router();

routes.get('/withAppState', async (_, res) => {
  try {
    await sendMessageWithAppState('Mai mot anh gui bang fb nay nha mieeee');
    res.send('WithAppState Okey roi nha');
  } catch (e) {
    console.log('e', e);
    res.send(`That Bai roi nha ${e.error}`);
  }
});

routes.get('/withFBCode', async (_, res) => {
  try {
    await sendMessageWithFBCode('Mieeeee map dit');
    res.send(' WithFBCode Okey roi nha');
  } catch (e) {
    console.log('e', e);
    res.send(`That Bai roi nha ${e.error}`);
  }
});

routes.get('/getCode', async (_, res) => {
  try {
    const db = admin.database();
    const refFBCode = db.ref('FB_CODE');
    let fbCode;
    await refFBCode.once('value', function(snapshot) {
      fbCode = snapshot.val();
    });
    res.send(`nice su ${fbCode}`);
  } catch (e) {
    console.log(e.toString());
  }
});

routes.get('/updateCode/:fbCode', async (req, res) => {
  try {
    const db = admin.database();
    const refFBCode = db.ref('FB_CODE');
    const { fbCode = '' } = req.params;

    if (fbCode.length < 6) return res.send('Nhập hẵn hoi vào');

    await refFBCode.set(fbCode);
    res.send(`nice su ${fbCode}`);
  } catch (e) {
    console.log(e.toString());
  }
});

routes.get('/sendNotification/:token', async (req, res) => {
  try {
    const { token = '' } = req.params;
    await NotificationService.sendSpecificDevices(token);
    res.send(`ok`);
  } catch (e) {
    res.send(`bug ${e}`);
  }
});

export default routes;
