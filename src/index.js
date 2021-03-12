import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import { settingConfig } from 'services';
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

server.listen(port, () => logger.info(`> Ready on port ${port}`));

settingConfig(server);



