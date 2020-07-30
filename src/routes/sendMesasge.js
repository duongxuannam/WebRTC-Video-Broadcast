import { Router } from 'express';
import { sendMessage, sendMessage2 } from '../services/sendMessage';

const routes = Router();

routes.get('/', (_, res) => {
  try {
    sendMessage('Mieeeee');
    res.send('Okey roi n ha');
  } catch (e) {
    console.log('e', e);
    res.send('That Bai roi nha');
  }
});

routes.get('/2', async (_, res) => {
  try {
    await sendMessage2('Mieeeee map dit');
    res.send('Okey roi n ha');
  } catch (e) {
    console.log('e', e);
    res.send('That Bai roi nha');
  }
});

export default routes;
