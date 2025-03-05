import { Request, Response, NextFunction } from 'express';
import { param } from 'express-validator';
import { validationResult } from 'express-validator'
import Budget from '../models/budget';

declare global {
    namespace Express {
        interface Request {
            budget?: Budget
        }
    }
}

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

export const validateBudgetExist = async (req: Request, res:Response, next:NextFunction) => {
    try{
        const {id} = req.params
        const budget = await Budget.findByPk(id)
        if(!budget){
            res.status(404).json({error: 'Budget not found'})
            return
        }
        req.budget=budget
        next()
    }
    catch(error){
        res.status(500).json({error: error.message})
    }
}