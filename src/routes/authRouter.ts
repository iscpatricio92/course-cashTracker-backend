import { Router } from "express";
import { AuthController } from "../controllers/AuthContoller";
import { body } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { limiter } from "../config/limiter";
const router = Router()
router.post('/create-account',
    body('email').isEmail().withMessage('Email is not valid'),
    body('password').isLength({ min: 4 }).withMessage('Password must be at least 4 characters long'),
    body('name').notEmpty().withMessage('Name is required'),
    handleInputErrors,
    AuthController.createAccount)

router.post('/confirm-account',
    limiter,
    body('token')
        .notEmpty()
        .isLength({ min: 6, max: 6 })
        .withMessage('Token is required'),
    handleInputErrors,
    AuthController.confirmAccount
)

router.post('/login',
    body('email').isEmail().withMessage('Email is not valid'),
    body('password').isLength({ min: 4 }).withMessage('Password must be at least 4 characters long'),
    handleInputErrors,
    AuthController.login)

router.post('/forgot-password',
    body('email').isEmail().withMessage('Email is not valid'),
    handleInputErrors,
    AuthController.forgotPassword
)

router.post('/validate-token',
    body('token')
        .notEmpty()
        .isLength({ min: 6, max: 6 })
        .withMessage('Token is required'),
    handleInputErrors,
    AuthController.validateToken
)

export default router