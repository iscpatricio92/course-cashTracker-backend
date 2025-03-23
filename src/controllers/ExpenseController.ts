import type { Request, Response } from 'express'
import Expense from '../models/Expense'

export class ExpensesController {
    static create = async (req: Request, res: Response) => {
        try{
            const expense = await Expense.create(req.body)
            expense.budgetId = req.budget.id
            await expense.save()
            res.status(201).json({message: 'Expense created successfully'})
        }
        catch(error){
            const err = new Error('Error creating expense')
            res.status(500).json({error:err.message})
        }
    }

    static getById = async (req: Request, res: Response) => {
        res.status(200).json(req.expense)
    }

    static updateById = async (req: Request, res: Response) => {
        await req.expense.update(req.body)
        res.status(200).json({message: 'Expense updated successfully'})
    }

    static deleteById = async (req: Request, res: Response) => {
        await req.expense.destroy()
        res.status(200).json({message: 'Expense deleted successfully'})
    }
}