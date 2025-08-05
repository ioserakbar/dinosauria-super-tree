import { Request, Response, NextFunction } from 'express';
import { Model } from 'mongoose';
import { HttpResponses } from '../../library/HttpResponses.enum';

export function MongoDelete(model: Model<any>) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
            try {
                const document = await model.findOneAndDelete({ _id: req.params.id });

                if (!document) return res.sendStatus(404);

                req.mongoDelete = document;
            } catch (error) {
                logging.error(error);

                return res.status(HttpResponses.InternalServerError).json(error);
            }

            return originalMethod.call(this, req, res, next);
        };

        return descriptor;
    };
}
