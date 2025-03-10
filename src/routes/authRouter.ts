import { Router } from "express";
import { AuthController } from "../controllers/AuthContoller";
import { body } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
const router = Router()

router.post('/create-account',
    body('email').isEmail().withMessage('Email is not valid'),
    body('password').isLength({ min: 4 }).withMessage('Password must be at least 4 characters long'),
    body('name').notEmpty().withMessage('Name is required'),
    handleInputErrors,
    AuthController.createAccount)
export default router