import { Router } from "express";
import { BudgetController } from "../controllers/BudgetController";
import { body, param } from 'express-validator'
import { validateBudgetExist, validateBudgetId, validateBudgetInput } from "../middleware/budget";

const router = Router()

router.param('budgetId', validateBudgetId)
router.param('budgetId', validateBudgetExist)

router.get('/', BudgetController.getAll)

router.post('/',
    validateBudgetInput,
    BudgetController.create
)

router.get('/:budgetId', BudgetController.getOne)

router.patch('/:budgetId',
    validateBudgetInput,
    BudgetController.updateById)

router.delete('/:budgetId', BudgetController.delete)

export default router