import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'

import { makeCurrency } from '../../tests/factories/make-currency'
import { InMemoryPaymentsRepository } from '../../tests/repositories/in-memory-payments-repository'

import { CreatePaymentUseCase } from './create-payment-use-case'

let paymentsRepository: InMemoryPaymentsRepository
let sut: CreatePaymentUseCase

describe('Tabs | Use Case: CreatePayment', () => {
	beforeEach(() => {
		paymentsRepository = new InMemoryPaymentsRepository()
		sut = new CreatePaymentUseCase(paymentsRepository)

		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('should create a payment and persist it', async () => {
		vi.setSystemTime(new Date('2026-03-01T12:00:00.000Z'))

		const { payment } = await sut.execute({
			payerId: 'payer-1',
			receiverId: 'receiver-1',
			amountInCents: 100,
			currency: makeCurrency({ iso: 'EUR' }),
			date: new Date(),
		})

		expect(payment.payerId.toString()).toBe('payer-1')
		expect(payment.receiverId.toString()).toBe('receiver-1')
		expect(payment.amountInCents).toBe(100)
		expect(payment.currency.iso).toBe('EUR')
		expect(payment.date).toEqual(new Date('2026-03-01T12:00:00.000Z'))
		expect(payment.groupId).toBeUndefined()

		expect(paymentsRepository.items).toEqual([payment])
	})

	it('should create a payment with an optional groupId', async () => {
		const { payment } = await sut.execute({
			payerId: 'payer-1',
			receiverId: 'receiver-1',
			amountInCents: 100,
			currency: makeCurrency({ iso: 'EUR' }),
			date: new Date(),
			groupId: 'group-1',
		})

		expect(payment.groupId).toEqual(new UniqueEntityId('group-1'))
	})
})
