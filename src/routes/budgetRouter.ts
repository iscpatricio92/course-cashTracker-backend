import { Router } from "express";
import { BudgetController } from "../controllers/BudgetController";
import { body, param } from 'express-validator'
import { validateBudgetExist, validateBudgetId } from "../middleware/budget";

const router = Router()

router.get('/', BudgetController.getAll)

router.post('/',
    body('name').notEmpty().withMessage('Budget name is required'),
    body('amount')
        .notEmpty().withMessage('Budget amount is required')
        .isNumeric().withMessage('amount must be a number')
        .custom((value) => value > 0).withMessage('amount must be greater than 0'),
    BudgetController.create
)

router.get('/:id',
    validateBudgetId,
    validateBudgetExist,
    BudgetController.getOne)

router.patch('/:id',
    validateBudgetId,
    validateBudgetExist,
    body('name').notEmpty().withMessage('Budget name is required'),
    body('amount')
        .notEmpty().withMessage('Budget amount is required')
        .isNumeric().withMessage('amount must be a number')
        .custom((value) => value > 0).withMessage('amount must be greater than 0'),
    BudgetController.updateById)

router.delete('/:id',
    validateBudgetId,
    validateBudgetExist,
    BudgetController.delete)

export default router