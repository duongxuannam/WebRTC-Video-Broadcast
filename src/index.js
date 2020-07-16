import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import SocketService from 'services/socketService';
import routes from 'routes';
import logger from 'utils/logger';
import configs from './config';

const app = express();

const port = configs.PORT || 1995;

const http = require('http');
const server = http.createServer(app);

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/../public'));

app.use('/', routes);

SocketService.start(server);

server.listen(port, () => logger.info(`> Ready on port ${port}`));

// keep server running
process.on('uncaughtException', (err) =>
  logger.error('uncaughtException: ' + err)
);
process.on('unhandledRejection', (err) =>
  logger.error('unhandledRejection: ' + err)
);
