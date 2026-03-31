import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { EqualSlice } from '../../enterprise/value-objects/slice'
import { makeExpense } from '../../tests/factories/make-expense'
import { InMemoryExpensesRepository } from '../../tests/repositories/in-memory-expenses-repository'
import { ListExpensesUseCase } from './list-expenses-use-case'

let expensesRepository: InMemoryExpensesRepository
let sut: ListExpensesUseCase

const userId = new UniqueEntityId('user-1')

const expenses = [
	makeExpense(
		{ payerId: userId, groupId: new UniqueEntityId('group-a') },
		{ id: new UniqueEntityId('expense-1') }
	),
	makeExpense(
		{
			split: {
				kind: 'equally',
				slices: [
					EqualSlice.create(userId),
					EqualSlice.create(new UniqueEntityId('friend-1')),
				],
			},
		},
		{ id: new UniqueEntityId('expense-2') }
	),
	makeExpense({}, { id: new UniqueEntityId('expense-3') }),
]

describe('Tabs | Use Case: ListExpenses', () => {
	beforeEach(() => {
		expensesRepository = new InMemoryExpensesRepository()
		sut = new ListExpensesUseCase(expensesRepository)
	})

	it('should list expenses for the user', async () => {
		expensesRepository.items.push(...expenses)

		const { expenses: result } = await sut.execute({ userId: 'user-1' })

		expect(result).toHaveLength(2)
		expect(result).toEqual([expenses[0], expenses[1]])
	})

	it('should not list expenses for other users', async () => {
		expensesRepository.items.push(...expenses)

		const { expenses: result } = await sut.execute({ userId: 'user-2' })

		expect(result).toHaveLength(0)
	})

	it('should return an empty list when the user has no expenses', async () => {
		const { expenses: result } = await sut.execute({ userId: 'user-1' })

		expect(result).toHaveLength(0)
	})

	it('should filter expenses by groupId', async () => {
		expensesRepository.items.push(...expenses)

		const { expenses: result } = await sut.execute({
			userId: 'user-1',
			filters: { groupId: 'group-a' },
		})

		expect(result).toHaveLength(1)
		expect(result).toEqual([expenses[0]])
	})

	it('should filter expenses by friendId', async () => {
		expensesRepository.items.push(...expenses)

		const { expenses: result } = await sut.execute({
			userId: 'user-1',
			filters: { friendId: 'friend-1' },
		})

		expect(result).toHaveLength(1)
		expect(result).toEqual([expenses[1]])
	})

	it('should paginate expenses', async () => {
		Array.from({ length: 25 }).forEach((_, index) => {
			expensesRepository.items.push(
				makeExpense(
					{ payerId: userId },
					{ id: new UniqueEntityId(`expense-${index + 1}`) }
				)
			)
		})

		const { expenses: result, meta } = await sut.execute({
			userId: 'user-1',
			page: 3,
			size: 10,
		})

		expect(result).toHaveLength(5)
		expect(meta).toEqual({
			page: 3,
			size: 10,
			itemCount: 5,
			totalItems: 25,
			totalPages: 3,
		})
	})
})
