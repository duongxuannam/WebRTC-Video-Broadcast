import login from 'facebook-chat-api';
import readline from 'readline';
import fs from 'fs';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const obj = {
  email: 'duongxuannam1995@gmail.com',
  password: 'matkhaufbduongxuannam1995@gmail.com',
};
// idCuaMie = '100008191653173'

export const sendMessage = (message = 'form Nam with love') => {
  login(
    { appState: JSON.parse(fs.readFileSync('appstate.json', 'utf8')) },
    // obj,
    (err, api) => {
      if (err) {
        switch (err.error) {
          case 'login-approval':
            console.log('Enter code > ');
            rl.on('line', (line) => {
              err.continue(line);
              rl.close();
            });
            break;
          default:
            console.error(err);
        }
        return;
      }
      console.log('xong ori nha');
      api.setOptions({
        logLevel: 'warn',
        // listenEvents: true,
        forceLogin: true,
      });
      fs.writeFileSync('appstate.json', JSON.stringify(api.getAppState()));

      // Logged in!
      const yourID = '100003453082379';
      // const yourID = '100004534216796';

      api.sendMessage(message, yourID);
      // console.log('api.getCurrentUserID()', api.getCurrentUserID());
    }
  );
};
export const sendMessage2 = (message = 'form Nam with love') => {
  login(obj, (err, api) => {
    if (err) {
      switch (err.error) {
        case 'login-approval':
          console.log('Enter code > ');
          rl.on('line', (line) => {
            err.continue(line);
            rl.close();
          });
          break;
        default:
          console.error(err);
      }
      return;
    }
    console.log('xong ori nha');
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
  });
};
