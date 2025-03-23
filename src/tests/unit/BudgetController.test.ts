import { createRequest, createResponse } from 'node-mocks-http'
import { BudgetController } from "../../controllers/BudgetController";
import { budgets } from "../mocks/budgets";
import Budget from '../../models/Budget';
import Expense from '../../models/Expense';

jest.mock('../../models/Budget', () => ({
    findAll: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn()
}))

describe('BudgetController', () => {
    describe('getAll', () => {
        beforeEach(() => {
            (Budget.findAll as jest.Mock).mockReset();
            (Budget.findAll as jest.Mock).mockImplementation((options) => {
                const updatedBudgets = budgets.filter(budget => budget.userId === options.where.userId);
                return Promise.resolve(updatedBudgets)
            })
        })

        it('should be defined', () => {
            expect(BudgetController.getAll).toBeDefined();
        });

        it('should retrieve 2 budgets for user with ID 1', async () => {

            const req = createRequest({
                method: 'GET',
                url: '/api/budgets',
                user: { id: 1 }
            })
            const res = createResponse();
            await BudgetController.getAll(req, res)

            const { data } = res._getJSONData()
            expect(data).toHaveLength(2);
            expect(res.statusCode).toBe(200)
        })

        it('should retrieve 1 budget for user with ID 2', async () => {

            const req = createRequest({
                method: 'GET',
                url: '/api/budgets',
                user: { id: 2 }
            })
            const res = createResponse();

            await BudgetController.getAll(req, res)

            const { data } = res._getJSONData()
            expect(data).toHaveLength(1);
            expect(res.statusCode).toBe(200)
            expect(res.status).not.toBe(404)
        })

        it('should retrieve 0 budgets for user with ID 10', async () => {

            const req = createRequest({
                method: 'GET',
                url: '/api/budgets',
                user: { id: 100 }
            })
            const res = createResponse();
            await BudgetController.getAll(req, res)

            const { data } = res._getJSONData()
            expect(data).toHaveLength(0);
            expect(res.statusCode).toBe(200)
            expect(res.status).not.toBe(404)
        })

        it('should handle errors when fetching budgets', async () => {
            const req = createRequest({
                method: 'GET',
                url: '/api/budgets',
                user: { id: 100 }
            })
            const res = createResponse();

            (Budget.findAll as jest.Mock).mockRejectedValue(new Error)
            await BudgetController.getAll(req, res)

            expect(res.statusCode).toBe(500)
            expect(res._getJSONData()).toEqual({ error: 'Error fetching budgets' })
        })
    });

    describe('create', () => {
        it('Should create a new budget and respond with statusCode 201', async () => {

            const budgetMock = {
                save: jest.fn().mockResolvedValue(true)
            };

            (Budget.create as jest.Mock).mockResolvedValue(budgetMock)
            const req = createRequest({
                method: 'POST',
                url: '/api/budgets',
                user: { id: 1 },
                body: { name: 'Budget test', amount: 1000 }
            })
            const res = createResponse();
            await BudgetController.create(req, res)

            const data = res._getJSONData()

            expect(res.statusCode).toBe(201)
            expect(data).toEqual({ message: 'Budget created successfully' })
            expect(budgetMock.save).toHaveBeenCalled()
            expect(budgetMock.save).toHaveBeenCalledTimes(1)
            expect(Budget.create).toHaveBeenCalledWith(req.body)
        })

        it('Should handle budget creation error', async () => {
            const budgetMock = {
                save: jest.fn()
            };

            (Budget.create as jest.Mock).mockRejectedValue(new Error)
            const req = createRequest({
                method: 'POST',
                url: '/api/budgets',
                user: { id: 1 },
                body: { name: 'Budget test', amount: 1000 }
            })
            const res = createResponse();
            await BudgetController.create(req, res)

            const data = res._getJSONData()

            expect(res.statusCode).toBe(500)
            expect(data).toEqual({ error: 'Error creating budget' })
            expect(budgetMock.save).not.toHaveBeenCalled()
            expect(Budget.create).toHaveBeenCalledWith(req.body)
        })
    })

    describe('getById', () => {

        beforeEach(() => {
            (Budget.findByPk as jest.Mock).mockImplementation((id) => {
                const budget = budgets.filter(b => b.id === id)[0]
                return Promise.resolve(budget)
            })
        })

        it('should return a budget with ID 1 and 3 expenses', async () => {
            const req = createRequest({
                method: 'GET',
                url: '/api/budgets/:budgetId',
                budget: { id: 1 }
            })
            const res = createResponse();
            await BudgetController.getById(req, res)

            const {data} = res._getJSONData()
            expect(res.statusCode).toBe(200)
            expect(data.expenses).toHaveLength(3)
            expect(Budget.findByPk).toHaveBeenCalled()
            expect(Budget.findByPk).toHaveBeenCalledTimes(1)
            expect(Budget.findByPk).toHaveBeenCalledWith(req.budget.id, {
                include: [Expense]
            })
        })

        it('should return a budget with ID 2 and 2 expenses', async () => {
            const req = createRequest({
                method: 'GET',
                url: '/api/budgets/:budgetId',
                budget: { id: 2 }
            })
            const res = createResponse();
            await BudgetController.getById(req, res)

            const {data} = res._getJSONData()
            expect(res.statusCode).toBe(200)
            expect(data.expenses).toHaveLength(2)
        })

        it('should return a budget with ID 3 and 0 expenses', async () => {
            const req = createRequest({
                method: 'GET',
                url: '/api/budgets/:budgetId',
                budget: { id: 3 }
            })
            const res = createResponse();
            await BudgetController.getById(req, res)

            const {data} = res._getJSONData()
            expect(res.statusCode).toBe(200)
            expect(data.expenses).toHaveLength(0)
        })
    })
})