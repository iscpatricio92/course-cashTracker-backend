import { createRequest, createResponse } from "node-mocks-http";
import { ExpensesController } from "../../../controllers/ExpenseController";
import Expense from "../../../models/Expense";

jest.mock('../../../models/Expense', () => ({
    create: jest.fn()
}))

describe('ExpenseController', () => {
    describe('create', () => {
        it('should create a new expense', async () => {
            const expenseMock = {
                save: jest.fn().mockResolvedValue(true)
            };
            (Expense.create as jest.Mock).mockResolvedValue(expenseMock)

            const req = createRequest({
                method: 'POST',
                url: '/api/budgets/:budgetId/expenses',
                body: {
                    amount: 100,
                    name: 'Test expense',
                },
                budget: { id: 1 }
            })
            const res = createResponse();
            await ExpensesController.create(req, res)

            expect(res.statusCode).toBe(201)
            expect(expenseMock.save).toHaveBeenCalled()
            expect(expenseMock.save).toHaveBeenCalledTimes(1)
            expect(Expense.create).toHaveBeenCalledWith(req.body)
            expect(res._getJSONData()).toEqual({ message: 'Expense created successfully' })
        })

        it('should handle expense creation error', async () => {
            const expenseMock = {
                save: jest.fn()
            };
            (Expense.create as jest.Mock).mockRejectedValue(new Error)

            const req = createRequest({
                method: 'POST',
                url: '/api/budgets/:budgetId/expenses',
                body: {
                    amount: 100,
                    name: 'Test expense',
                },
                budget: { id: 1 }
            })
            const res = createResponse();
            await ExpensesController.create(req, res)

            expect(res.statusCode).toBe(500)
            expect(expenseMock.save).not.toHaveBeenCalled()
            expect(Expense.create).toHaveBeenCalledWith(req.body)
            expect(res._getJSONData()).toEqual({ error: 'Error creating expense' })
        })
    })
})