import express from 'express'
import colors from 'colors'
import morgan from 'morgan'
import { db } from './config/db'
import budgetRouter from './routes/budgetRouter'
import authRouter from './routes/authRouter'
import { AUTH, BASE, BUDGETS } from './constants/endpoints'

export const connectDB = async () => {
    try {
        await db.authenticate()
        db.sync()
        console.log(colors.blue.bold('Connection has been established successfully.'))
    } catch (error) {
        console.log(colors.red.bold(`Error: ${error.message}`))
        process.exit(1)
    }
}
connectDB()

const app = express()

app.use(morgan('dev'))

app.use(express.json())

app.use(`${BUDGETS}`, budgetRouter)
app.use(`${AUTH}`, authRouter)
app.get(`${BASE}`, (req, res) => {
    res.json({message:'Api found :D'})
})

export default app