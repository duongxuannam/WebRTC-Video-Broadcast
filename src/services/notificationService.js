import logger from 'utils/logger';
import FirebaseAdmin from './firebaseAdmin';

const admin = FirebaseAdmin.admin();

class _NotificationService {
  constructor() {}

  async sendSpecificDevices(registrationToken = '') {
    try {
      const message = {
        data: {
          score: '850',
          time: '2:45',
        },
        token: registrationToken,
        android: {
          priority: 'normal',
          notification: {
            title: 'Thong bao thoi',
            body: 'aaaasdasda as',
          },
          data: {
            metaData: JSON.stringify({
              score: '850',
              time: '2:45',
            }),
          },
        },
        apns: {
          headers: {
            'apns-priority': '10',
          },
          payload: {
            aps: {
              alert: {
                title: 'Thong bao thoi',
                body: 'aaaasdasda as',
              },
              sound: 'default',
            },
            metaData: {
              score: '850',
              time: '2:45',
            },
          },
        },
      };
      // Send a message to the device corresponding to the provided
      // registration token.
      const response = await admin.messaging().send(message);
      logger.error(`Successfully sent message:${response}` );
    } catch (error) {
      logger.error(`Error sending message:${error}`, );
    }
  }

  async sendMultiDevices(registrationTokens = []) {
    try {
      const message = {
        data: {
          score: '850',
          time: '2:45',
        },
        tokens: registrationTokens,
      };
      // Send a message to the device corresponding to the provided
      // registration token.
      const response = await admin.messaging().sendMulticast(message);
      logger.error(`Successfully sent message:${response}`);
    } catch (error) {
      logger.error(`Error sending message:${error}` );
    }
  }

  async sendTopic(topic = '') {
    try {
      const message = {
        data: {
          score: '850',
          time: '2:45',
        },
        topic,
      };
      // Send a message to the device corresponding to the provided
      // registration token.
      const response = await admin.messaging().send(message);
      logger.error(`Successfully sent message:${response}`, );
    } catch (error) {
      logger.error(`Error sending message:${error}`);
    }
  }

  async wakeUpAndroid(registrationToken = '') {
    try {
      const message = {
        data: {
          score: '850',
          time: '2:45',
        },
        token: registrationToken,
        android: {
          direct_boot_ok: true,
        },
      };
      // Send a message to the device corresponding to the provided
      // registration token.
      const response = await admin.messaging().send(message);
      logger.error(`Successfully sent message:${response}`);
    } catch (error) {
      logger.error(`Error sending message:${error}`);
    }
  }
}

const NotificationService = new _NotificationService();

export default NotificationService;
