import request from 'supertest';
import { application, Shutdown } from '../../src/server';

describe('Our Application', () => {
    afterAll((done) => {
        Shutdown(done);
    });

    it('Starts and has te proper test enviorment', async () => {
        expect(process.env.NODE_ENV).toBe('test');
        expect(application).toBeDefined();
    }, 10000);

    it('Returns all options allowed to be called by customers (http methods', async () => {
        const response = await request(application).options('/');

        expect(response.status).toBe(200);
        expect(response.headers['access-control-allow-methods']).toBe('PUT, POST, PATCH, DELETE, GET');
    });
});
