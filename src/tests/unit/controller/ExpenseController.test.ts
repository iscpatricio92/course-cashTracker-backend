import { createRequest, createResponse } from "node-mocks-http";
import { ExpensesController } from "../../../controllers/ExpenseController";
import Expense from "../../../models/Expense";
import { expenses } from "../../mocks/expenses";

jest.mock('../../../models/Expense', () => ({
    create: jest.fn(),
    update: jest.fn(),
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

    describe('getById', () => {
        it('should return an expense with Id 1', async () => {
            const req = createRequest({
                method: 'GET',
                url: '/api/budgets/:budgetId/expenses/:expenseId',
                expense: expenses[0]
            })
            const res = createResponse();
            await ExpensesController.getById(req, res)

            expect(res.statusCode).toBe(200)
            expect(res._getJSONData()).toEqual(expenses[0])
        })
    })

    describe('updateById', () => {
        it('should update an expense', async () => {

            const expensesMock = {
                ...expenses[0],
                update: jest.fn()
            }
            const req = createRequest({
                method: 'PUT',
                url: '/api/budgets/:budgetId/expenses/:expenseId',
                body: {
                    amount: 100,
                    name: 'Test updated expense',
                },
                expense: expensesMock
            })
            const res = createResponse();
            await ExpensesController.updateById(req, res)
            const data = res._getJSONData()

            expect(res.statusCode).toBe(200)
            expect(expensesMock.update).toHaveBeenCalled()
            expect(expensesMock.update).toHaveBeenCalledWith(req.body)
            expect(expensesMock.update).toHaveBeenCalledTimes(1)
            expect(data).toEqual({ message: 'Expense updated successfully' })
        })
    })

    describe('deleteById', () => {
        it('should delete an expense', async () => {
            const expensesMock = {
                ...expenses[0],
                destroy: jest.fn()
            }
            const req = createRequest({
                method: 'DELETE',
                url: '/api/budgets/:budgetId/expenses/:expenseId',
                expense: expensesMock
            })
            const res = createResponse();
            await ExpensesController.deleteById(req, res)

            expect(res.statusCode).toBe(200)
            expect(expensesMock.destroy).toHaveBeenCalled()
            expect(expensesMock.destroy).toHaveBeenCalledTimes(1)
            expect(res._getJSONData()).toEqual({ message: 'Expense deleted successfully' })
        })
    })
})