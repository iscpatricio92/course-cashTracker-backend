import { Router } from "express";
import { BudgetController } from "../controllers/BudgetController";
import {body} from 'express-validator'
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
router.get('/:id', BudgetController.getOne)
router.patch('/:id', BudgetController.update)
router.delete('/:id', BudgetController.delete)

export default router