import { CronJob } from 'cron';
import request from 'request';

import { sendMessageWithAppState } from './sendMessage';

const sendMessage = () => {
  sendMessageWithAppState('a j no mo to');
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
      //   '* * * * * *',
      '00 26 17 * * *',
      sendMessage,
      null,
      false,
      //   'America/Los_Angeles'
      'Asia/Ho_Chi_Minh'
    );

    this.wakeUp = new CronJob(
      //   '* * * * * *',
      '0 */28 * * * *',
      wakeUp,
      null,
      false,
      //   'America/Los_Angeles'
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
