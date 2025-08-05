import { Request, Response, NextFunction } from 'express';
import { Model } from 'mongoose';
import { HttpResponses } from '../../library/HttpResponses.enum';

export function MongoGetAll(model: Model<any>) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
            try {
                const documents = await model.find();
                req.mongoGetAll = documents;
            } catch (error) {
                logging.error(error);

                return res.status(HttpResponses.InternalServerError).json(error);
            }

            return originalMethod.call(this, req, res, next);
        };

        return descriptor;
    };
}
