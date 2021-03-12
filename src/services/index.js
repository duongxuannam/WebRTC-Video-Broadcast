import i18n from 'i18n';
import mongoose from 'mongoose';
import FirebaseAdmin from 'services/firebaseAdmin';
import DynamicValues from 'services/dynamicValues';
import SocketService from 'services/socketService';
import logger from 'utils/logger';
import configs from '../config';

export const settingConfig = (server) => {
    FirebaseAdmin.init();
    DynamicValues.init();
    // ScheduleService.startSendMessage();
    SocketService.start(server);


    //init multi language
    i18n.configure({
        locales: ['en', 'vi'],
        directory: __dirname + '/languages',
        defaultLocale: 'vi',
        cookie: 'i18n'
    });


    // Connect MongoDB
    mongoose.connect(configs.MONGO_URL, { useNewUrlParser: true });
    const db = mongoose.connection;
    db.on('open', () => {
        logger.info('DB connected');
    });

    db.on('error', (err) => logger.error(err));

    // keep server running
    process.on('uncaughtException', (err) =>
        logger.error('uncaughtException: ' + err)
    );
    process.on('unhandledRejection', (err) =>
        logger.error('unhandledRejection: ' + err)
    );
};