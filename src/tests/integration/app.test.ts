import request from 'supertest';
import server, { connectDB } from '../../server';
import { db } from '../../config/db';
import { AUTH, CREATE_ACCOUNT } from '../../constants/endpoints';
import { AuthController } from '../../controllers/AuthController';
describe('CashTracker Integrations Test', () => {
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

            it('should return 400 when email is invalid', async () => {
                const response = await request(server)
                    .post(`${AUTH}${CREATE_ACCOUNT}`)
                    .send({
                        "name": "John Doe",
                        "email": "not_valid_email",
                        "password": "123456"
                    });

                const createAccountMock = jest.spyOn(AuthController, 'createAccount');
                expect(response.status).toBe(400);
                expect(response.body).toHaveProperty('errors');
                expect(response.body.errors).toHaveLength(1);
                expect(response.body.errors[0].msg).toBe('Email is not valid');

                expect(response.status).not.toBe(201);
                expect(response.body.errors).not.toHaveLength(2);
                expect(createAccountMock).not.toHaveBeenCalled();
            });

            it('should return 400 status code when password is less than 4 characters', async () => {
                const response = await request(server)
                    .post(`${AUTH}${CREATE_ACCOUNT}`)
                    .send({
                        "name": "John Doe",
                        "email": "test@test.com",
                        "password": "123"
                    });

                const createAccountMock = jest.spyOn(AuthController, 'createAccount');
                expect(response.status).toBe(400);
                expect(response.body).toHaveProperty('errors');
                expect(response.body.errors).toHaveLength(1);
                expect(response.body.errors[0].msg).toBe('Password must be at least 4 characters long');

                expect(response.status).not.toBe(201);
                expect(response.body.errors).not.toHaveLength(2);
                expect(createAccountMock).not.toHaveBeenCalled();
            });

            it('should register a new user successfully', async () => {
                const userData = {
                    "name": "John Doe",
                    "email": "test@test.com",
                    "password": "123456"
                };
                const response = await request(server)
                    .post(`${AUTH}${CREATE_ACCOUNT}`)
                    .send(userData);

                expect(response.status).toBe(201);
                expect(response.status).not.toBe(400);
                expect(response.body).toEqual({ message: "Account created successfully" });
            });
        });
    });
});