import { faker } from '@faker-js/faker'

import {
	Currency,
	type CurrencyProps,
} from '../../enterprise/value-objects/currency'

export function makeCurrency(override: Partial<CurrencyProps> = {}) {
	return Currency.create({
		name: faker.finance.currencyName(),
		symbol: faker.finance.currencySymbol(),
		iso: faker.finance.currencyCode(),
		...override,
	})
}
