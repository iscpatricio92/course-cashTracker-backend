import type { Request, Response } from 'express'
import User from '../models/User'
import { hashPassword } from '../utils/auth';

export class AuthController {
    static createAccount = async (req: Request, res: any) => {
        //avoid duplicate emails
        const {email, password} = req.body
        const userExists = await User.findOne({where: {email}})
        if(userExists){
            const error = new Error('Email already exists')
            return res.status(409).json({error: error.message})
        }
        try{
            const user = new User(req.body)
            user.password = await hashPassword(password)
            await user.save()
            res.json({message: 'Account created successfully'})
        }
        catch(error){
            res.status(500).json({error: error.message})
        }
    }

    /* static getById = async (req: Request, res: Response) => {
        res.status(200).json(req.expense)
    }

    static updateById = async (req: Request, res: Response) => {
        await req.expense.update(req.body)
        res.status(200).json({message: 'Expense updated successfully'})
    }

    static deleteById = async (req: Request, res: Response) => {
        await req.expense.destroy()
        res.status(200).json({message: 'Expense deleted successfully'})
    } */
}