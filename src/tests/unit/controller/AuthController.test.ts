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
})