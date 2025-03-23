import request  from 'supertest';
import server, { connectDB } from '../../server';
import { db } from '../../config/db';
import { AUTH, CREATE_ACCOUNT } from '../../constants/endpoints';
import { AuthController } from '../../controllers/AuthController';
describe('CashTracker Integrations Test', () =>{
    /* beforeAll(async () => {
        await connectDB();
    }); */

    // Close the Sequelize connection after all tests are done
    /* afterAll(async () => {
        await db.close();
    }); */

    it('should return a 200 status code from the home url', async () => {
        const response = await request(server).get('/');
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Api found :D');
    });

    describe('Authentication', () => {
        describe('Create account', () => {
            it('should display validations errors when form is empty', async () => {
                const response = await request(server)
                    .post(`${AUTH}${CREATE_ACCOUNT}`)
                    .send({});

                const createAccountMock = jest.spyOn(AuthController, 'createAccount');
                expect(response.status).toBe(400);
                expect(response.body).toHaveProperty('errors');
                expect(response.body.errors).toHaveLength(3);

                expect(response.status).not.toBe(201);
                expect(response.body.errors).not.toHaveLength(2);
                expect(createAccountMock).not.toHaveBeenCalled();
            });
        });
    });
});