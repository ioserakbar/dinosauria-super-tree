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
    logging.log('-----------------------------');
    logging.log('Initializing API');
    logging.log('-----------------------------');
    application.use(express.urlencoded({ extended: true }));
    application.use(express.json());

    logging.log('-----------------------------');
    logging.log('Logging & Configuration');
    logging.log('-----------------------------');
    application.use(loggingHandler);
    application.use(corsHandler);

    logging.log('-----------------------------');
    logging.log('Define Controller Routing');
    logging.log('-----------------------------');
    defineRoutes([MainController], application);

    logging.log('-----------------------------');
    logging.log('Define Routing');
    logging.log('-----------------------------');
    application.use(routeNotFound);

    logging.log('-----------------------------');
    logging.log('Starting Server');
    logging.log('-----------------------------');
    httpServer = http.createServer(application);
    httpServer.listen(SERVER.SERVER_PORT, () => {
        logging.log('-----------------------------');
        logging.log(`Start Started: ${SERVER.SERVER_HOSTNAME}:${SERVER.SERVER_PORT}`);
        logging.log('-----------------------------');
    });
};

export const Shutdown = (callback: any) => httpServer && httpServer.close(callback);

Main();
