import request  from 'supertest';
import server, { connectDB } from '../../server';
import e from 'express';
describe('App', () =>{
    beforeAll(async () => {
        await connectDB();
    });
    it('should return a 200 status code from the home url', async () => {
        const response = await request(server).get('/');
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Api found :D');
    });
});