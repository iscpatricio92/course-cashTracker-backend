import { createRequest, createResponse } from 'node-mocks-http'
import { AuthController } from '../../../controllers/AuthController'
import User from '../../../models/User'
import { checkPassword, hashPassword } from '../../../utils/auth'
import { generateToken } from '../../../utils/token'
import { AuthEmail } from '../../../emails/AuthEmail'
import { generateJWT } from '../../../utils/jwt'

jest.mock('../../../models/User')
jest.mock('../../../utils/auth')
jest.mock('../../../utils/token')
jest.mock('../../../utils/jwt')

describe('AuthController', () => {
    describe('createAccount', () => {

        beforeEach(() => {
            jest.clearAllMocks()
        })
        it('should return  a 409 status and an error message if the email is already register', async () => {
            (User.findOne as jest.Mock).mockResolvedValueOnce(true)
            const req = createRequest({
                method: 'POST',
                url: '/api/auth/create-account',
                body: {
                    email: 'test@test.com',
                    password: 'password'
                }
            })
            const res = createResponse()

            await AuthController.createAccount(req, res)

            const data = res._getJSONData()
            expect(res.statusCode).toBe(409)
            expect(data).toHaveProperty('error', 'Email already exists')
            expect(User.findOne).toHaveBeenCalled()
            expect(User.findOne).toHaveBeenCalledTimes(1)
        })

        it('should register a new user and return a success message', async () => {
            const token = '123456'
            const req = createRequest({
                method: 'POST',
                url: '/api/auth/create-account',
                body: {
                    email: "test@test.com",
                    password: "testpassword",
                    name: "Test Name"
                }
            })
            const res = createResponse();

            const mockUser = {
                ...req.body,
                password: 'hashedPassword',
                token: token,
                save: jest.fn()
            };

            (User.create as jest.Mock).mockResolvedValue(mockUser);
            (hashPassword as jest.Mock).mockReturnValue('hashedPassword');
            (generateToken as jest.Mock).mockReturnValue(token);
            jest.spyOn(AuthEmail, "sendConfirmationEmail").mockImplementation(() => Promise.resolve());

            await AuthController.createAccount(req, res)

            expect(User.create).toHaveBeenCalledWith({
                ...req.body,
                password: 'hashedPassword',
                token: token
            })
            expect(User.create).toHaveBeenCalledTimes(1)
            expect(mockUser.password).toBe('hashedPassword')
            expect(mockUser.token).toBe(token)
            expect(AuthEmail.sendConfirmationEmail).toHaveBeenCalledWith({
                email: req.body.email,
                name: req.body.name,
                token: token
            })
            expect(AuthEmail.sendConfirmationEmail).toHaveBeenCalledTimes(1)
            expect(res.statusCode).toBe(201)
        })
    })

    describe('login', () => {
        beforeEach(() => {
            jest.clearAllMocks()
        })
        it('should return a 404 if user not found', async () => {
            (User.findOne as jest.Mock).mockResolvedValueOnce(null)
            const req = createRequest({
                method: 'POST',
                url: '/api/auth/login',
                body: {
                    email: 'test@test.com',
                    password: 'password'
                }
            })
            const res = createResponse()

            await AuthController.login(req, res)

            const data = res._getJSONData()
            expect(res.statusCode).toBe(404)
            expect(data).toEqual({ error: 'User not found' })
        })

        it('should return a 403 if account is not confirmed', async () => {
            (User.findOne as jest.Mock).mockResolvedValueOnce({
                id: 1,
                confirmed: false,
                email: 'test@test.com',
                password: 'password'
            })
            const req = createRequest({
                method: 'POST',
                url: '/api/auth/login',
                body: {
                    email: 'test@test.com',
                    password: 'password'
                }
            })
            const res = createResponse()

            await AuthController.login(req, res)

            const data = res._getJSONData()
            expect(res.statusCode).toBe(403)
            expect(data).toEqual({ error: 'Account not confirmed' })
        });

        it('should return 401 if the password is incorrect', async () => {
            const userMock = {
                id: 1,
                email: "test@test.com",
                password: "password",
                confirmed: true
            };
            (User.findOne as jest.Mock).mockResolvedValue(userMock)

            const req = createRequest({
                method: 'POST',
                url: '/api/auth/login',
                body: {
                    email: "test@test.com",
                    password: "testpassword"
                }
            })
            const res = createResponse();

            (checkPassword as jest.Mock).mockResolvedValue(false)

            await AuthController.login(req, res)

            const data = res._getJSONData()
            expect(res.statusCode).toBe(401)
            expect(data).toEqual({ error: 'Invalid password' })
            expect(checkPassword).toHaveBeenCalledWith(req.body.password, userMock.password)
            expect(checkPassword).toHaveBeenCalledTimes(1)
        });

        it('should return a JWT if authentication is successful', async () => {
            const userMock = {
                id: 1,
                email: "test@test.com",
                password: "hashed_password",
                confirmed: true
            };
            const req = createRequest({
                method: 'POST',
                url: '/api/auth/login',
                body: {
                    email: "test@test.com",
                    password: "password"
                }
            })
            const res = createResponse();

            const fakejwt = 'fake_jwt';

            (User.findOne as jest.Mock).mockResolvedValue(userMock);
            (checkPassword as jest.Mock).mockResolvedValue(true);
            (generateJWT as jest.Mock).mockReturnValue(fakejwt);

            await AuthController.login(req, res)

            const data = res._getJSONData()
            expect(res.statusCode).toBe(200)
            expect(data).toEqual({ message: 'Login successful', token: fakejwt })
            expect(generateJWT).toHaveBeenCalledTimes(1)
            expect(generateJWT).toHaveBeenCalledWith(userMock.id)
        })
    })
})