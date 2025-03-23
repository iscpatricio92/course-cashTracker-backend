import { Request, Response, NextFunction } from 'express';
import { param, validationResult } from 'express-validator'
import Expense from '../models/Expense';

declare global {
    namespace Express {
        interface Request {
            expense?: Expense
        }
    }
}

export const validateExpenseInput = async (req: Request, res: Response, next: NextFunction) => {
    await param('name').notEmpty().withMessage('Expense name is required').run(req);
    await param('amount')
        .notEmpty().withMessage('Expense amount is required')
        .isNumeric().withMessage('amount must be a number')
        .custom((value) => value > 0).withMessage('amount must be greater than 0')
        .run(req);
    next();
}

export const validateExpenseId = async (req: Request, res: Response, next: NextFunction) => {
    await param('expenseId')
        .isInt().custom((value) => value > 0)
        .withMessage('ID is not valid')
        .run(req);
    next();
}

export const validateExpenseExists = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { expenseId } = req.params
        const expense = await Expense.findByPk(expenseId)
        if (!expense) {
            const error = new Error('Expense not found')
            res.status(404).json({ error: error.message })
            return
        }
        req.expense = expense
        next()
    }
    catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const belongsToBudget = async (req: Request, res: Response, next: NextFunction) => {
    if(req.budget.id !== req.expense.budgetId) {
        const error = new Error('Acción no válida')
        return res.status(403).json({error: error.message})
    }
    next()
}