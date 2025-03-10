import express from 'express'
import colors from 'colors'
import morgan from 'morgan'
import { db } from './config/db'
import budgetRouter from './routes/budgetRouter'
import authRouter from './routes/authRouter'

const connectDB = async () => {
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

app.use('/api/budgets', budgetRouter)
app.use('/api/auth', authRouter)

export default app