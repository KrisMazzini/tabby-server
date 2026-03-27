import { Currency } from './currency'

describe('Tabs | Value object: Currency', () => {
	it('should create a currency and normalize iso to uppercase', () => {
		const currency = Currency.create({
			name: 'Real',
			symbol: 'R$',
			iso: 'brl',
		})

		expect(currency.name).toBe('Real')
		expect(currency.symbol).toBe('R$')
		expect(currency.iso).toBe('BRL')
	})

	it('should compare equal currencies by iso', () => {
		const a = Currency.create({
			name: 'Real',
			symbol: 'R$',
			iso: 'BRL',
		})

		const b = Currency.create({
			name: 'Brazilian Real',
			symbol: 'R$',
			iso: 'brl',
		})

		expect(a.equals(b)).toBe(true)
	})

	it('should compare different currencies by iso', () => {
		const a = Currency.create({
			name: 'Real',
			symbol: 'R$',
			iso: 'BRL',
		})

		const b = Currency.create({
			name: 'Real',
			symbol: 'R$',
			iso: 'USD',
		})

		expect(a.equals(b)).toBe(false)
	})
})
