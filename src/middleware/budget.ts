import { Request, Response, NextFunction } from 'express';
import { param } from 'express-validator';
import { validationResult } from 'express-validator'
export const validateBudgetId = async (req: Request, res:Response, next:NextFunction) => {
    await param('id').isInt().withMessage('id must be a number')
    .custom(value => value > 0)
    .withMessage('id must be greater than 0')
    .run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    } else {
        next();
    }
}