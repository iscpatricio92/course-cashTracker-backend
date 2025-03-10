import type { Request, Response } from 'express'
import Budget from '../models/Budget'
import Expense from '../models/Expense'

export class BudgetController {
    static getAll = async (req: Request, res: Response) => {
        try {
            const budgets = await Budget.findAll({
                order: [
                    ['createdAt', 'DESC']
                ],
                where: {
                    //userId: req.user.id
                }
            })
            res.json({data: budgets})
        } catch (error) {
            res.status(500).json({error: error.message})
        }
    }

    static create = async (req: Request, res: Response) => {
        try {
            const budget = await Budget.create(req.body)
            //budget.userId = req.user.id
            await budget.save()
            res.status(201).json({message: 'Budget created successfully'})
        } catch (error) {
            res.status(500).json({error: error.message})
        }
    }

    static getById = async (req: Request, res: Response) => {
        const budget = await Budget.findByPk(req.budget.id, {
            include: [Expense]
        })
        res.json({data: budget})
    }

    static updateById = async (req: Request, res: Response) => {
        await req.budget.update(req.body)
        res.json({message: 'Budget updated successfully'})
    }

    static deleteById = async (req: Request, res: Response) => {
        await req.budget.destroy()
        res.json({message: 'Budget deleted successfully'})
    }

}