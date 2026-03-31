import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { makePayment } from '../../tests/factories/make-payment'
import { InMemoryPaymentsRepository } from '../../tests/repositories/in-memory-payments-repository'
import { DeletePaymentUseCase } from './delete-payment-use-case'

let paymentsRepository: InMemoryPaymentsRepository
let sut: DeletePaymentUseCase

describe('Tabs | Use Case: DeletePayment', () => {
	beforeEach(() => {
		paymentsRepository = new InMemoryPaymentsRepository()
		sut = new DeletePaymentUseCase(paymentsRepository)
	})

	it('should delete a payment when the executor is the payer', async () => {
		const payment = makePayment(
			{ payerId: new UniqueEntityId('payer-1') },
			{ id: new UniqueEntityId('payment-1') }
		)

		paymentsRepository.items.push(payment)

		await sut.execute({
			paymentId: 'payment-1',
			userId: 'payer-1',
		})

		expect(paymentsRepository.items).toHaveLength(0)
	})

	it('should not delete a payment when the executor is not the payer', async () => {
		const payment = makePayment(
			{ payerId: new UniqueEntityId('payer-1') },
			{ id: new UniqueEntityId('payment-1') }
		)

		paymentsRepository.items.push(payment)

		await expect(
			sut.execute({
				paymentId: 'payment-1',
				userId: 'payer-2',
			})
		).rejects.toBeInstanceOf(NotAllowedError)

		expect(paymentsRepository.items).toHaveLength(1)
	})

	it('should not delete a payment when the payment does not exist', async () => {
		await expect(
			sut.execute({
				paymentId: 'unknown-payment',
				userId: 'payer-1',
			})
		).rejects.toBeInstanceOf(ResourceNotFoundError)
	})
})
