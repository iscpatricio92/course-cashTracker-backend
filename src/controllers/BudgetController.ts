import type { Request, Response } from 'express';
export class BudgetController{
    static getAll= (req: Request, res:Response) => {
        res.send('Hello World')
    }
    static create= (req: Request, res:Response) => {
        res.send('Hello World')
    }
    static getOne= (req: Request, res:Response) => {
        res.send('Hello World')
    }
    static update= (req: Request, res:Response) => {
        res.send('Hello World')
    }
    static delete= (req: Request, res:Response) => {
        res.send('Hello World')
    }
}