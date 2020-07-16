import { Router } from 'express';
// import auth from './authentication';
// import users from './users';

import { verifyToken } from 'controllers/authController';

const routes = Router();

routes.use(verifyToken);

//page index

routes.get('/hello2', (req, res) => res.send('Hello Worldddd!'));

routes.get('/hello', (req, res) => res.send('Hello World!'));

// routes.use('/auth', auth);
// routes.use('/users', users);
// // routes.use('/images', images);

routes.use((err, req, res, next) => {
  if (err.name !== 'HttpError' || !err.errorCode) return next(err);
  res.status(err.errorCode).json({ message: err.message });
});

export default routes;
