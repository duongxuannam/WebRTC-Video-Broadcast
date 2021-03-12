import { Router } from 'express';
import { verifyToken } from 'controllers/authController';
import users from './users';

const routes = Router();

routes.use(verifyToken);

routes.get('/hello', (req, res) => res.send('Hello World!'));


// routes.use('/auth', auth);
routes.use('/users', users);
// routes.use('/images', images);

routes.use((err, req, res, next) => {
  if (err.name !== 'HttpError' || !err.errorCode) return next(err);
  res.status(err.errorCode).json({ message: err.message });
});

export default routes;
