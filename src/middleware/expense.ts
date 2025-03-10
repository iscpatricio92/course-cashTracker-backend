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

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    } else {
        next();
    }
}

export const validateExpenseId = async (req: Request, res: Response, next: NextFunction) => {
    await param('expenseId')
        .isInt().withMessage('expenseId must be a number')
        .custom((value) => value > 0).withMessage('amount must be greater than 0')
        .run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    } else {
        next();
    }
}

export const validateExpenseExist = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { expenseId } = req.params
        const expense = await Expense.findByPk(expenseId)
        if (!expense) {
            res.status(404).json({ error: 'Expense not found' })
            return
        }
        req.expense = expense
        next()
    }
    catch (error) {
        res.status(500).json({ error: error.message })
    }
}