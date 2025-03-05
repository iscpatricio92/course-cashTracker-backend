import { Router } from "express";
import { BudgetController } from "../controllers/BudgetController";
import { body, param } from 'express-validator'
import { handleInputErrors } from "../middleware/validation";

const router = Router()

router.get('/', BudgetController.getAll)

router.post('/',
    body('name').notEmpty().withMessage('Budget name is required'),
    body('amount')
        .notEmpty().withMessage('Budget amount is required')
        .isNumeric().withMessage('amount must be a number')
        .custom((value) => value > 0).withMessage('amount must be greater than 0'),
    handleInputErrors,
    BudgetController.create
)

router.get('/:id',
    param('id').isInt().withMessage('id must be a number')
    .custom(value => value > 0).withMessage('id must be greater than 0'),
    handleInputErrors,
    BudgetController.getOne)

router.patch('/:id',
    param('id').isInt().withMessage('id must be a number')
    .custom(value => value > 0).withMessage('id must be greater than 0'),
    body('name').notEmpty().withMessage('Budget name is required'),
    body('amount')
        .notEmpty().withMessage('Budget amount is required')
        .isNumeric().withMessage('amount must be a number')
        .custom((value) => value > 0).withMessage('amount must be greater than 0'),
    handleInputErrors,
    BudgetController.updateById)

router.delete('/:id',
    param('id').isInt().withMessage('id must be a number')
    .custom(value => value > 0).withMessage('id must be greater than 0'),
    handleInputErrors,
    BudgetController.delete)

export default router