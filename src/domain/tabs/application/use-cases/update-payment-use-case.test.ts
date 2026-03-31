import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { makeCurrency } from '../../tests/factories/make-currency'
import { makePayment } from '../../tests/factories/make-payment'
import { InMemoryPaymentsRepository } from '../../tests/repositories/in-memory-payments-repository'
import { UpdatePaymentUseCase } from './update-payment-use-case'

let paymentsRepository: InMemoryPaymentsRepository
let sut: UpdatePaymentUseCase

describe('Tabs | Use Case: UpdatePayment', () => {
	beforeEach(() => {
		paymentsRepository = new InMemoryPaymentsRepository()
		sut = new UpdatePaymentUseCase(paymentsRepository)

		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('should update a payment and persist it', async () => {
		const payment = makePayment(
			{ payerId: new UniqueEntityId('payer-1') },
			{ id: new UniqueEntityId('payment-1') }
		)

		paymentsRepository.items.push(payment)

		vi.setSystemTime(new Date('2026-03-01T12:00:00.000Z'))
		const newCurrency = makeCurrency({ iso: 'EUR' })

		const { payment: updated } = await sut.execute({
			paymentId: 'payment-1',
			userId: 'payer-1',
			amountInCents: 200,
			currency: newCurrency,
			date: new Date(),
		})

		expect(updated.amountInCents).toBe(200)
		expect(updated.currency).toEqual(newCurrency)
		expect(updated.date).toEqual(new Date('2026-03-01T12:00:00.000Z'))

		const persisted = await paymentsRepository.findById(payment.id.toString())

		expect(persisted).toEqual(updated)
	})

	it('should update a payment groupId', async () => {
		const payment = makePayment(
			{ payerId: new UniqueEntityId('payer-1') },
			{ id: new UniqueEntityId('payment-1') }
		)

		paymentsRepository.items.push(payment)

		const { payment: updated } = await sut.execute({
			paymentId: 'payment-1',
			userId: 'payer-1',
			amountInCents: 100,
			currency: makeCurrency({ iso: 'BRL' }),
			date: new Date(),
			groupId: 'group-1',
		})

		expect(updated.groupId).toEqual(new UniqueEntityId('group-1'))
	})

	it('should clear groupId when updating without passing groupId', async () => {
		const payment = makePayment(
			{
				payerId: new UniqueEntityId('payer-1'),
				groupId: new UniqueEntityId('group-1'),
			},
			{ id: new UniqueEntityId('payment-1') }
		)

		paymentsRepository.items.push(payment)

		const { payment: updated } = await sut.execute({
			paymentId: 'payment-1',
			userId: 'payer-1',
			amountInCents: 100,
			currency: makeCurrency({ iso: 'BRL' }),
			date: new Date(),
		})

		expect(updated.groupId).toBeUndefined()
	})

	it('should not be possible to update a payment if the user is not the payer', async () => {
		const payment = makePayment(
			{ payerId: new UniqueEntityId('payer-1') },
			{ id: new UniqueEntityId('payment-1') }
		)

		paymentsRepository.items.push(payment)

		await expect(
			sut.execute({
				paymentId: 'payment-1',
				userId: 'payer-2',
				amountInCents: 200,
				currency: makeCurrency({ iso: 'EUR' }),
				date: new Date(),
			})
		).rejects.toBeInstanceOf(NotAllowedError)
	})

	it('should not be possible to update a payment if the payment does not exist', async () => {
		await expect(
			sut.execute({
				paymentId: 'unknown-payment',
				userId: 'payer-1',
				amountInCents: 200,
				currency: makeCurrency({ iso: 'EUR' }),
				date: new Date(),
			})
		).rejects.toBeInstanceOf(ResourceNotFoundError)
	})
})
