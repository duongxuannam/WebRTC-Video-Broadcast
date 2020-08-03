import { CronJob } from 'cron';
import request from 'request';
import DynamicValues from './dynamicValues';
import msgData from '../utils/sourceTanGai';
import { sendMessageWithAppState } from './sendMessage';

const sendMessage = async () => {
  try {
    const number = DynamicValues.numberMessage;
    const msg = msgData[number];
    await sendMessageWithAppState(msg);
    DynamicValues.setNumberMessageFirebase(number + 1);
  } catch (e) {
    console.log(e);
  }
};

const wakeUp = () => {
  request('https://apimongo.herokuapp.com/wakeUp', function(
    error,
    response,
    body
  ) {
    if (!error && response.statusCode == 200) {
      console.log(body); // Print the google web page.
    }
  });
};

class _ScheduleService {
  constructor() {
    this.sendMessage = new CronJob(
      '00 29 05 * * *',
      //   '*/30 * * * * *',
      sendMessage,
      null,
      false,
      'Asia/Ho_Chi_Minh'
    );

    this.wakeUp = new CronJob(
      //   '* * * * * *',
      '0 */28 * * * *',
      wakeUp,
      null,
      false,
      'Asia/Ho_Chi_Minh'
    );
  }

  startSendMessage() {
    this.sendMessage.start();
    this.wakeUp.start();
  }
}

const ScheduleService = new _ScheduleService();

export default ScheduleService;
