import { Router } from "express";
import { BudgetController } from "../controllers/BudgetController";
import { body, param } from 'express-validator'
import { validateBudgetExist, validateBudgetId } from "../middleware/budget";

const router = Router()

router.param('budgetId', validateBudgetId)
router.param('budgetId', validateBudgetExist)

router.get('/', BudgetController.getAll)

router.post('/',
    body('name').notEmpty().withMessage('Budget name is required'),
    body('amount')
        .notEmpty().withMessage('Budget amount is required')
        .isNumeric().withMessage('amount must be a number')
        .custom((value) => value > 0).withMessage('amount must be greater than 0'),
    BudgetController.create
)

router.get('/:budgetId', BudgetController.getOne)

router.patch('/:budgetId',
    body('name').notEmpty().withMessage('Budget name is required'),
    body('amount')
        .notEmpty().withMessage('Budget amount is required')
        .isNumeric().withMessage('amount must be a number')
        .custom((value) => value > 0).withMessage('amount must be greater than 0'),
    BudgetController.updateById)

router.delete('/:budgetId', BudgetController.delete)

export default router