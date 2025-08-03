import http from 'http';
import express from 'express';
import './config/logging';
import { loggingHandler } from './middleware/loggingHandler';
import { corsHandler } from './middleware/corsHandler';
import { routeNotFound } from './middleware/routeNotFound';
import { SERVER } from './config/config';
import 'reflect-metadata';
import { defineRoutes } from './modules/routes';
import MainController from './controllers/main';

export const application = express();
export let httpServer: ReturnType<typeof http.createServer>;

export const Main = () => {
    logging.info('-----------------------------');
    logging.info('Initializing API');
    logging.info('-----------------------------');
    application.use(express.urlencoded({ extended: true }));
    application.use(express.json());

    logging.info('-----------------------------');
    logging.info('Logging & Configuration');
    logging.info('-----------------------------');
    application.use(loggingHandler);
    application.use(corsHandler);

    logging.info('-----------------------------');
    logging.info('Define Controller Routing');
    logging.info('-----------------------------');
    defineRoutes([MainController], application);

    logging.info('-----------------------------');
    logging.info('Define Routing Routing');
    logging.info('-----------------------------');
    application.use(routeNotFound);

    logging.info('-----------------------------');
    logging.info('Start Server');
    logging.info('-----------------------------');
    httpServer = http.createServer(application);
    httpServer.listen(SERVER.SERVER_PORT, () => {
        logging.info('-----------------------------');
        logging.info(`Start Started: ${SERVER.SERVER_HOSTNAME}:${SERVER.SERVER_PORT}`);
        logging.info('-----------------------------');
    });
};

export const Shutdown = (callback: any) => httpServer && httpServer.close(callback);

Main();
