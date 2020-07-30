import { Router } from 'express';
import sendMessage from './sendMesasge';

import { verifyToken } from 'controllers/authController';

const routes = Router();

routes.use(verifyToken);

//page index

routes.get('/wakeUp', (req, res) => {
  console.log('wake upppppp');
  res.send('Hello Worldddd!');
});

routes.get('/hello', (req, res) => res.send('Hello World!'));

routes.use('/sendMessage', sendMessage);

// routes.use('/auth', auth);
// routes.use('/users', users);
// // routes.use('/images', images);

routes.use((err, req, res, next) => {
  if (err.name !== 'HttpError' || !err.errorCode) return next(err);
  res.status(err.errorCode).json({ message: err.message });
});

export default routes;
