import http from 'http';
import express from 'express';
import './config/logging';
import { loggingHandler } from './middleware/loggingHandler';
import { corsHandler } from './middleware/corsHandler';
import { routeNotFound } from './middleware/routeNotFound';
import { MONGO, SERVER } from './config/config';
import 'reflect-metadata';
import { defineRoutes } from './modules/routes';
import mongoose from 'mongoose';
import SpeciesController from './controller/speciesController';
import { declareHandler } from './middleware/declareHandler';

export const application = express();
export let httpServer: ReturnType<typeof http.createServer>;

export const Main = async () => {
    logging.log('Initializing API...');
    application.use(express.urlencoded({ extended: true }));
    application.use(express.json());

    logging.log('Connecting to Mongo...');
    try {
        const connection = await mongoose.connect(MONGO.MONGO_CONNECTION, MONGO.MONGO_OPTIONS);
        logging.log('Connected to Mongo', connection.version);
    } catch (error) {
        logging.error('Unable to connect to Mongo DB');
        logging.error(error);
    }

    logging.log('Logging & Configuration...');
    application.use(declareHandler);
    application.use(loggingHandler);
    application.use(corsHandler);

    logging.log('Service Routing...');
    defineRoutes([SpeciesController], application);

    logging.log('Define Routing...');
    application.use(routeNotFound);

    logging.log('Starting Server...');
    httpServer = http.createServer(application);
    httpServer.listen(SERVER.SERVER_PORT, () => {
        logging.log('-----------------------------');
        logging.log(`Start Started: ${SERVER.SERVER_HOSTNAME}:${SERVER.SERVER_PORT}`);
        logging.log('-----------------------------');
    });
};

export const Shutdown = (callback: any) => httpServer && httpServer.close(callback);

Main();
