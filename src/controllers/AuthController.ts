import type { Request } from 'express'
import User from '../models/User'
import { checkPassword, hashPassword } from '../utils/auth';
import { generateToken } from '../utils/token';
import { AuthEmail } from '../emails/AuthEmail';
import { generateJWT } from '../utils/jwt';
import { verify } from 'jsonwebtoken';

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
            const user = await User.create({
                ...req.body,
                password: await hashPassword(password),
                token: generateToken()
            })
            //send welcome email
            await AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: user.token
            })
            res.status(201).json({message: 'Account created successfully'})
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

        const isPasswordCorrect = await checkPassword(password, user.password)
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

    static resetPasswordWithToken = async (req: Request, res: any) => {
        const {token} = req.params
        const {password} = req.body

        const user = await User.findOne({where: {token}})
        if(!user){
            const error = new Error('Invalid token')
            return res.status(404).json({error: error.message})
        }

        //asign new password
        user.password = await hashPassword(password)
        user.token = null
        await user.save()

        res.json({
            message: 'Password has been successfully changed',
        })
    }

    static user = async (req: Request, res: any) => {
        res.json({
            'message': 'User data',
            user: req.user
        })
    }

    static updateCurrentUserPassword = async (req: Request, res: any) => {
        const {current_password, password} = req.body
        const {id} = req.user

        const user = await User.findByPk(id)
        const isPasswordCorrect = await checkPassword(current_password, user.password)
        if(!isPasswordCorrect){
            const error = new Error('Invalid current password')
            return res.status(401).json({error: error.message})
        }
        user.password = await hashPassword(password)
        await user.save()
        res.json({message:' User password updated', user});
    }

    static checkPassword = async (req: Request, res: any) => {
        const {password} = req.body
        const {id} = req.user

        const user = await User.findByPk(id)
        const isPasswordCorrect = await checkPassword(password, user.password)
        if(!isPasswordCorrect){
            const error = new Error('Invalid current password')
            return res.status(401).json({error: error.message})
        }
        res.json({message:'Validated successfully password', user});
    }
}