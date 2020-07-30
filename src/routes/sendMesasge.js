import { Router } from 'express';
import { sendMessage } from '../services/sendMessage';

const routes = Router();

// Get bookings
routes.get('/', (_, res) => {
  try {
    sendMessage('Mieeeee');
    res.send('Okey roi n ha');
  } catch (e) {
    console.log('e', e);
    res.send('That Bai roi nha');
  }
});

export default routes;
