import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { limiter } from "../config/limiter";
import { authenticate } from '../middleware/auth';
import { CHECKED_PASSWORD, CONFIRM_ACCOUNT, CREATE_ACCOUNT, FORGOT_PASSWORD, GET_USER, LOGIN, RESET_PASSWORD, UPDATE_PASSWORD, VALIDATE_TOKEN } from "../constants/endpoints";
const router = Router()
router.post(
    CREATE_ACCOUNT,
    body('email').isEmail().withMessage('Email is not valid'),
    body('password').isLength({ min: 4 }).withMessage('Password must be at least 4 characters long'),
    body('name').notEmpty().withMessage('Name is required'),
    handleInputErrors,
    AuthController.createAccount)

router.post(
    CONFIRM_ACCOUNT,
    limiter,
    body('token')
        .notEmpty()
        .isLength({ min: 6, max: 6 })
        .withMessage('Token is required'),
    handleInputErrors,
    AuthController.confirmAccount
)

router.post(
    LOGIN,
    body('email').isEmail().withMessage('Email is not valid'),
    body('password').isLength({ min: 4 }).withMessage('Password must be at least 4 characters long'),
    handleInputErrors,
    AuthController.login)

router.post(
    FORGOT_PASSWORD,
    body('email').isEmail().withMessage('Email is not valid'),
    handleInputErrors,
    AuthController.forgotPassword
)

router.post(
    VALIDATE_TOKEN,
    body('token')
        .notEmpty()
        .isLength({ min: 6, max: 6 })
        .withMessage('Token is required'),
    handleInputErrors,
    AuthController.validateToken
)

router.post(
    RESET_PASSWORD,
    body('password').isLength({ min: 4 }).withMessage('Password must be at least 4 characters long'),
    param('token')
        .notEmpty()
        .isLength({ min: 6, max: 6 })
        .withMessage('Token is required'),
    handleInputErrors,
    AuthController.resetPasswordWithToken
)

router.get(
    GET_USER,
    authenticate,
    AuthController.user
)

router.post(
    UPDATE_PASSWORD,
    authenticate,
    body('current_password')
        .notEmpty()
        .withMessage('Password must be provided'),
    body('password')
        .isLength({ min: 4 })
        .withMessage('Password must be at least 4 characters long'),
    handleInputErrors,
    AuthController.updateCurrentUserPassword
)

router.post(
    CHECKED_PASSWORD,
    authenticate,
    body('password')
        .notEmpty()
        .withMessage('Password must be provided'),
    handleInputErrors,
    AuthController.checkPassword
)

export default router