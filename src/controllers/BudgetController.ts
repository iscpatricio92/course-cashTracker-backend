import type { Request, Response } from 'express';
import Budget from '../models/Budget';
export class BudgetController{
    static getAll= async(req: Request, res:Response, next:any) => {
        try{
            const budgets = await Budget.findAll({
                order: [['createdAt', 'DESC']],
                limit: 10,
                //TODO: filter by user
            })
            res.status(201).json({data: budgets})
        }
        catch(error){
            res.status(500).json({error: error.message})
        }
    }
    static create= async (req: Request, res:Response) => {
        try{
            const budget = new Budget(req.body)
            await budget.save()
            res.status(201).json({message: 'Budget created successfully'})
        }
        catch(error){
            res.status(500).json({error: error.message})
        }
    }
    static getOne= (req: Request, res:Response) => {
        
    }
    static update= (req: Request, res:Response) => {
        res.send('Hello World')
    }
    static delete= (req: Request, res:Response) => {
        res.send('Hello World')
    }
}