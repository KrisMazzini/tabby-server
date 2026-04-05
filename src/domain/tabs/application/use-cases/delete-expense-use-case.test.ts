import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { makeExpense } from '../../tests/factories/make-expense'
import { InMemoryExpensesRepository } from '../../tests/repositories/in-memory-expenses-repository'
import { DeleteExpenseUseCase } from './delete-expense-use-case'

let expensesRepository: InMemoryExpensesRepository
let sut: DeleteExpenseUseCase

describe('Tabs | Use Case: DeleteExpense', () => {
	beforeEach(() => {
		expensesRepository = new InMemoryExpensesRepository()
		sut = new DeleteExpenseUseCase(expensesRepository)
	})

	it('should delete an expense', async () => {
		const expense = makeExpense(
			{
				payerId: new UniqueEntityId('payer-1'),
			},
			{ id: new UniqueEntityId('expense-1') }
		)

		expensesRepository.items.push(expense)

		await sut.execute({
			expenseId: 'expense-1',
			userId: 'payer-1',
		})

		expect(expensesRepository.items).toHaveLength(0)
		expect(await expensesRepository.findById('expense-1')).toBeNull()
	})

	it('should not delete an expense if the user is not the payer', async () => {
		const expense = makeExpense(
			{ payerId: new UniqueEntityId('payer-1') },
			{ id: new UniqueEntityId('expense-1') }
		)

		expensesRepository.items.push(expense)

		await expect(
			sut.execute({
				expenseId: 'expense-1',
				userId: 'payer-2',
			})
		).rejects.toBeInstanceOf(NotAllowedError)

		expect(expensesRepository.items).toHaveLength(1)
	})

	it('should not delete an expense if the expense does not exist', async () => {
		await expect(
			sut.execute({
				expenseId: 'expense-1',
				userId: 'payer-1',
			})
		).rejects.toBeInstanceOf(ResourceNotFoundError)
	})
})
