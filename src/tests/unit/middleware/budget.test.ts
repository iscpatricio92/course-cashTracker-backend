import { createRequest, createResponse } from "node-mocks-http"
import { validateBudgetExists } from "../../../middleware/budget"
import Budget from "../../../models/Budget"
import { budgets } from "../../mocks/budgets"

jest.mock('../../../models/Budget', () => ({
    findByPk: jest.fn()
}))
describe('Budget Middleware', () => {
    describe('validateBudgetExists', () => {
        it('should handle non-existing budget', async () => {
            (Budget.findByPk as jest.Mock).mockResolvedValue(null)
            const req = createRequest({
                params: { budgetId: 1 }
            })

            const res = createResponse()
            const next = jest.fn()

            await validateBudgetExists(req, res, next)
            const data = res._getJSONData()
            expect(res.statusCode).toBe(404)
            expect(data).toEqual({ error: 'Budget not found' })
            expect(next).not.toHaveBeenCalled()
        })

        it('should proceed to next middleware if budget exist', async () => {
            (Budget.findByPk as jest.Mock).mockResolvedValue(budgets[0])
            const req = createRequest({
                params: { budgetId: 1 }
            })

            const res = createResponse()
            const next = jest.fn()

            await validateBudgetExists(req, res, next)
            expect(next).toHaveBeenCalled()
            expect(req.budget).toBe(budgets[0])
        })

        it('should handle server error', async () => {
            (Budget.findByPk as jest.Mock).mockRejectedValue(new Error('Server error'))
            const req = createRequest({
                params: { budgetId: 1 }
            })

            const res = createResponse()
            const next = jest.fn()

            await validateBudgetExists(req, res, next)
            const data = res._getJSONData()
            expect(res.statusCode).toBe(500)
            expect(data).toEqual({ error: 'Server error' })
            expect(next).not.toHaveBeenCalled()
        })
    })
})