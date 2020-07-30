import { CronJob } from 'cron';
import { sendMessageWithAppState } from './sendMessage';

const sendMessage = () => {
  sendMessageWithAppState('a j no mo to');
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
  }

  startSendMessage() {
    this.sendMessage.start();
  }
}

const ScheduleService = new _ScheduleService();

export default ScheduleService;
