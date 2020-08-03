import login from 'facebook-chat-api';
import fs from 'fs';

import DynamicValues from '../services/dynamicValues';
// use typing input from terminal
// import readline from 'readline';
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

const obj = {
  email: 'duongxuannam1995@gmail.com',
  password: 'matkhaufbduongxuannam1995@gmail.com',
};
// idCuaMie = '100008191653173'

export const sendMessageWithAppState = (message = 'From Nam with love') => {
  return new Promise((resolve, reject) => {
    login(
      { appState: JSON.parse(fs.readFileSync('appstate.json', 'utf8')) },
      // obj,
      (err, api) => {
        if (err) {
          switch (err.error) {
            case 'login-approval':
              // use typing input from terminal
              // console.log('Enter code > ');
              // rl.on('line', (line) => {
              //   err.continue(line);
              //   rl.close();
              // });
              err.continue(DynamicValues.FB_CODE);
              break;
            default:
              console.error(err);
          }
          return reject(err);
        }
        console.log('login done');
        api.setOptions({
          logLevel: 'warn',
          // listenEvents: true,
          forceLogin: true,
        });
        fs.writeFileSync('appstate.json', JSON.stringify(api.getAppState()));

        // Logged in!
        // const mieID = '100008191653173';

        const namID = '100003453082379';

        // api.sendMessage(message, mieID);
        api.sendMessage(message, namID);

        // console.log('api.getCurrentUserID()', api.getCurrentUserID());
        return resolve();
      }
    );
  });
};
export const sendMessageWithFBCode = (message = 'form Nam with love') => {
  return new Promise((resolve, reject) => {
    login(obj, (err, api) => {
      if (err) {
        switch (err.error) {
          case 'login-approval':
            // use typing input from terminal
            // console.log('Enter code > ');
            // rl.on('line', (line) => {
            //   err.continue(line);
            //   rl.close();
            // });
            err.continue(DynamicValues.FB_CODE);
            break;
          default:
            console.error(err);
        }
        return reject(err);
      }
      console.log('login done');
      api.setOptions({
        logLevel: 'warn',
        // listenEvents: true,
        forceLogin: true,
      });
      fs.writeFileSync('appstate.json', JSON.stringify(api.getAppState()));

      // Logged in!
      const yourID = '100003453082379';
      api.sendMessage(message, yourID);
      // console.log('api.getCurrentUserID()', api.getCurrentUserID());
      return resolve();
    });
  });
};
