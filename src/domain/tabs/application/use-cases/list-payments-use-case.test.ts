import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { makePayment } from '../../tests/factories/make-payment'
import { InMemoryPaymentsRepository } from '../../tests/repositories/in-memory-payments-repository'
import { ListPaymentsUseCase } from './list-payments-use-case'

let paymentsRepository: InMemoryPaymentsRepository
let sut: ListPaymentsUseCase

const userId = new UniqueEntityId('user-1')

const payments = [
	makePayment(
		{ payerId: userId, groupId: new UniqueEntityId('group-a') },
		{ id: new UniqueEntityId('payment-1') }
	),
	makePayment({ payerId: userId }, { id: new UniqueEntityId('payment-2') }),
	makePayment(
		{ receiverId: userId, groupId: new UniqueEntityId('group-a') },
		{ id: new UniqueEntityId('payment-3') }
	),
	makePayment({ receiverId: userId }, { id: new UniqueEntityId('payment-4') }),
	makePayment({}, { id: new UniqueEntityId('payment-5') }),
	makePayment({}, { id: new UniqueEntityId('payment-6') }),
]

describe('Tabs | Use Case: ListPayments', () => {
	beforeEach(() => {
		paymentsRepository = new InMemoryPaymentsRepository()
		sut = new ListPaymentsUseCase(paymentsRepository)
	})

	it('should list all payments for the user', async () => {
		paymentsRepository.items.push(...payments)

		const { payments: result, meta } = await sut.execute({ userId: 'user-1' })

		expect(result).toHaveLength(4)
		expect(result).toEqual([payments[0], payments[1], payments[2], payments[3]])

		expect(meta).toEqual({
			page: 1,
			size: 20,
			itemCount: 4,
			totalItems: 4,
			totalPages: 1,
		})
	})

	it('should not list payments for other users', async () => {
		paymentsRepository.items.push(...payments)

		const { payments: result } = await sut.execute({ userId: 'user-2' })

		expect(result).toHaveLength(0)
	})

	it('should filter payments by role', async () => {
		paymentsRepository.items.push(...payments)

		const { payments: result } = await sut.execute({
			userId: 'user-1',
			filters: { role: 'receiver' },
		})

		expect(result).toHaveLength(2)
		expect(result).toEqual([payments[2], payments[3]])
	})

	it('should filter payments by groupId', async () => {
		paymentsRepository.items.push(...payments)

		const { payments: result } = await sut.execute({
			userId: 'user-1',
			filters: { groupId: 'group-a' },
		})

		expect(result).toHaveLength(2)
		expect(result).toEqual([payments[0], payments[2]])
	})

	it('should return an empty list when the user has no payments', async () => {
		const { payments: result } = await sut.execute({ userId: 'user-1' })

		expect(result).toHaveLength(0)
	})

	it('should paginate payments', async () => {
		Array.from({ length: 25 }).forEach((_, index) => {
			paymentsRepository.items.push(
				makePayment(
					{ payerId: userId },
					{ id: new UniqueEntityId(`payment-${index + 1}`) }
				)
			)
		})

		const { payments: result, meta } = await sut.execute({
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
