import { Request, Response, NextFunction } from 'express';
import { param, validationResult } from 'express-validator';
import Budget from '../models/Budget';

declare global {
    namespace Express {
        interface Request {
            budget?: Budget
        }
    }
}

export const validateBudgetId = async (req: Request, res: Response, next: NextFunction) => {
    await param('budgetId')
        .isInt().withMessage('id must be a number').bail()
        .custom(value => value > 0)
        .withMessage('id must be greater than 0')
        .run(req);

    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    } else {
        next();
    }
}

export const validateBudgetExists = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { budgetId } = req.params
        const budget = await Budget.findByPk(budgetId)
        if (!budget) {
            const error = new Error('Budget not found')
            return res.status(404).json({ error: error.message })
        }
        req.budget = budget
        next()
    }
    catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const validateBudgetInput = async (req: Request, res: Response, next: NextFunction) => {
    await param('name')
        .notEmpty().withMessage('Budget name is required').run(req);
    await param('amount')
        .notEmpty().withMessage('Budget amount is required')
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


/* export function hasAccess(req: Request, res: Response, next: NextFunction) {
    if(req.budget.userId !== req.user.id) {
        const error = new Error('Acción no válida')
        return res.status(401).json({error: error.message})
    }
    next()
} */