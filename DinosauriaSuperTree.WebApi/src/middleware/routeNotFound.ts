import { Request, Response, NextFunction } from 'express';
import { HttpResponses } from '../library/HttpResponses.enum';

export function routeNotFound(req: Request, res: Response, next: NextFunction) {
    const error = new Error('Route Not Found');

    logging.error(error);

    return res.status(HttpResponses.NotFound).json({ error: error.message });
}
