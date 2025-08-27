import { Request, Response, NextFunction } from 'express';
import { Controller } from '../decorators/controller';
import { Route } from '../decorators/route';
import { MongoGetAll } from '../decorators/mongoose/getAll';
import { CladeModel as Clade } from '../models/clade';
import { MongoGet } from '../decorators/mongoose/get';
import { MongoCreate } from '../decorators/mongoose/create';
import { MongoQuery } from '../decorators/mongoose/query';
import { MongoUpdate } from '../decorators/mongoose/update';
import { MongoDelete } from '../decorators/mongoose/delete';
import { HttpResponses } from '../library/HttpResponses.enum';
import { GetCladogramData } from '../decorators/clade';

@Controller('/clade')
class CladeController {
    @Route('get', '/get/all')
    @MongoGetAll(Clade)
    async getAll(req: Request, res: Response, next: NextFunction) {
        return res.status(HttpResponses.OK).json(req.mongoGetAll);
    }

    @Route('get', '/get/:id')
    @MongoGet(Clade)
    async get(req: Request, res: Response, next: NextFunction) {
        return res.status(HttpResponses.OK).json(req.mongoGet);
    }

    @Route('post', '/create')
    @MongoCreate(Clade)
    async create(req: Request, res: Response, next: NextFunction) {
        return res.status(HttpResponses.Created).json(req.mongoCreate);
    }

    @Route('post', '/query')
    @MongoQuery(Clade)
    async query(req: Request, res: Response, next: NextFunction) {
        return res.status(HttpResponses.OK).json(req.mongoQuery);
    }

    @Route('patch', '/update/:id')
    @MongoUpdate(Clade)
    async update(req: Request, res: Response, next: NextFunction) {
        return res.status(HttpResponses.Created).json(req.mongoUpdate);
    }

    @Route('delete', '/delete/:id')
    @MongoDelete(Clade)
    async delete(req: Request, res: Response, next: NextFunction) {
        return res.status(HttpResponses.OK).json(req.mongoDelete);
    }

    @Route('get', '/cladogram/:id')
    @GetCladogramData()
    async getCladogramMapCoordinates(req: Request, res: Response, next: NextFunction) {
        return res.status(HttpResponses.OK).json(req.cladogramData);
    }
}

export default CladeController;
