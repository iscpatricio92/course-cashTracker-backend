import { Router } from "express";
import { BudgetController } from "../controllers/BudgetController";
import { body, param } from 'express-validator'
import { validateBudgetExist, validateBudgetId, validateBudgetInput } from "../middleware/budget";
import { ExpensesController } from "../controllers/ExpenseController";
import { validateExpenseExist, validateExpenseId, validateExpenseInput } from "../middleware/expense";

const router = Router()

router.param('budgetId', validateBudgetId)
router.param('budgetId', validateBudgetExist)
router.param('expenseId', validateExpenseId)
router.param('expenseId', validateExpenseExist)

router.get('/', BudgetController.getAll)
router.post('/',validateBudgetInput,BudgetController.create)
router.get('/:budgetId', BudgetController.getOne)
router.patch('/:budgetId',validateBudgetInput,BudgetController.updateById)
router.delete('/:budgetId', BudgetController.delete)

/**Router for expenses */
router.post('/:budgetId/expenses', validateExpenseInput, ExpensesController.create)
router.get('/:budgetId/expenses/:expenseId', ExpensesController.getById)
router.patch('/:budgetId/expenses/:expenseId', validateExpenseInput, ExpensesController.updateById)
router.delete('/:budgetId/expenses/:expenseId', ExpensesController.deleteById)

export default router