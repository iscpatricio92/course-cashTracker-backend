import type { Request } from 'express'
import User from '../models/User'
import { checkPassword, hashPassword } from '../utils/auth';
import { generateToken } from '../utils/token';
import { AuthEmail } from '../emails/AuthEmail';
import { generateJWT } from '../utils/jwt';

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
            user.token = generateToken()
            await user.save()
            //send welcome email
            await AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: user.token
            })
            res.json({message: 'Account created successfully'})
        }
        catch(error){
            res.status(500).json({error: error.message})
        }
    }

    static confirmAccount = async (req: Request, res: any) => {
        const {token} = req.body
        const user = await User.findOne({where:{token}})
        if(!user){
            const error = new Error('Invalid token')
            return res.status(401).json({error: error.message})
        }
        user.confirmed = true
        user.token = null
        await user.save()
        res.json({message: 'Account confirmed successfully'})
    }

    static login = async (req: Request, res: any) => {
        const {email, password} = req.body
        const user = await User.findOne({where: {email}})
        if(!user){
            const error = new Error('User not found')
            return res.status(404).json({error: error.message})
        }
        if(!user.confirmed){
            const error = new Error('Account not confirmed')
            return res.status(403).json({error: error.message})
        }

        const isPasswordCorrect = checkPassword(password, user.password)
        if(!isPasswordCorrect){
            const error = new Error('Invalid password')
            return res.status(401).json({error: error.message})
        }

        const token = generateJWT(user.id)
        res.json({message: 'Login successful', token})
    }

    static forgotPassword = async (req: Request, res: any) => {
        const {email} = req.body
        const user = await User.findOne({where: {email}})
        if(!user){
            const error = new Error('User not found')
            return res.status(404).json({error: error.message})
        }
        user.token = generateToken()
        await user.save()

        await AuthEmail.sendPasswordResetToken({
            name: user.name,
            email: user.email,
            token: user.token
        })
        res.json({message: 'Password reset email sent',user})
    }

    static validateToken = async (req: Request, res: any) => {
        const {token} = req.body

        const tokenExist = await User.findOne({where: {token}})
        if(!tokenExist){
            const error = new Error('Invalid token')
            return res.status(404).json({error: error.message})
        }
        res.json({message: 'Token valid'})
    }
}