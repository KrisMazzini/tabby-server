import { InvalidAmountError } from '../../errors/invalid-amount-error'
import { makeCurrency } from '../../tests/factories/make-currency'
import { Payment } from './payment'

describe('Tabs | Entity: Payment', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('should be possible to create a payment', () => {
		vi.setSystemTime(new Date('2026-03-28'))

		const payment = Payment.create({
			payerId: 'payer-1',
			receiverId: 'receiver-1',
			amountInCents: 100,
			currency: makeCurrency({ iso: 'BRL' }),
			date: new Date(),
		})

		expect(payment.payerId).toBe('payer-1')
		expect(payment.receiverId).toBe('receiver-1')
		expect(payment.amountInCents).toBe(100)
		expect(payment.currency.iso).toBe('BRL')
		expect(payment.date).toEqual(new Date('2026-03-28'))
	})

	it('should not be possible to create a payment with an amount less  than or equal to 0', () => {
		expect(() =>
			Payment.create({
				payerId: 'payer-1',
				receiverId: 'receiver-1',
				amountInCents: 0,
				currency: makeCurrency({ iso: 'BRL' }),
				date: new Date(),
			})
		).toThrow(InvalidAmountError)
	})

	it('should not be possible to update the amomunt with a value less than or equal to 0', () => {
		const payment = Payment.create({
			payerId: 'payer-1',
			receiverId: 'receiver-1',
			amountInCents: 100,
			currency: makeCurrency({ iso: 'BRL' }),
			date: new Date(),
		})

		expect(() => (payment.amountInCents = 0)).toThrow(InvalidAmountError)
	})
})
