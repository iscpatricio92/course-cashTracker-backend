import { createRequest, createResponse } from "node-mocks-http";
import Expense from "../../../models/Expense";
import { expenses } from "../../mocks/expenses";
import { validateExpenseExists } from "../../../middleware/expense";
import { budgets } from '../../mocks/budgets';
import { hasAccess } from "../../../middleware/budget";

jest.mock('../../../models/Expense', () => ({
    findByPk: jest.fn()
}));

describe('Expense Middleware', () => {
    describe('validateExpenseExists', () => {
        beforeEach(() => {
            (Expense.findByPk as jest.Mock).mockReset();
            (Expense.findByPk as jest.Mock).mockImplementation((id) => {
                const expense = expenses.filter(e => e.id === id)[0] ?? null;
                return Promise.resolve(expense)
            })
        });
        it('should handle a non-existing budget', async () => {
            const req = createRequest({
                params: { expenseId: 120 }
            });

            const res = createResponse();
            const next = jest.fn();

            await validateExpenseExists(req, res, next);
            const data = res._getJSONData();
            expect(res.statusCode).toBe(404);
            expect(data).toEqual({ error: 'Expense not found' });
            expect(next).not.toHaveBeenCalled();
        })

        it('should call next middleware if expense exist', async () => {
            const req = createRequest({
                params: { expenseId: 1 }
            });

            const res = createResponse();
            const next = jest.fn();

            await validateExpenseExists(req, res, next);
            expect(next).toHaveBeenCalled();
            expect(next).toHaveBeenCalledTimes(1);
            expect(req.expense).toEqual(expenses[0]);
        })

        it('should handle an error', async () => {
            (Expense.findByPk as jest.Mock).mockImplementation(() => {
                throw new Error('Error');
            });

            const req = createRequest({
                params: { expenseId: 1 }
            });

            const res = createResponse();
            const next = jest.fn();

            await validateExpenseExists(req, res, next);
            const data = res._getJSONData();
            expect(res.statusCode).toBe(500);
            expect(data).toEqual({ error: 'Error' });
            expect(next).not.toHaveBeenCalled();
        });

        it('should prevent unauthorized user from adding expenses', async () => {
            const req = createRequest({
                method: 'POST',
                url: '/api/budgets/:budgetId/expenses',
                budget: budgets[0],
                user: { id: 20 },
                body: { name: 'Expense test', amount: 100 }
            });

            const res = createResponse();
            const next = jest.fn();

            hasAccess(req, res, next);
            const data = res._getJSONData();
            expect(res.statusCode).toBe(401);
            expect(data).toEqual({ error: 'Access denied' });
            expect(next).not.toHaveBeenCalled();
        })
    })
})