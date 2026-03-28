import { faker } from '@faker-js/faker'

import type { EntityArgs } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'

import { Expense, type ExpenseProps } from '../../enterprise/entities/expense'
import { EqualSlice } from '../../enterprise/value-objects/slice'

import { makeCurrency } from './make-currency'

export function makeExpense(
	override: Partial<ExpenseProps> = {},
	args?: EntityArgs
) {
	const u1 = new UniqueEntityId()
	const u2 = new UniqueEntityId()

	return Expense.create(
		{
			payerId: new UniqueEntityId(),
			description: faker.commerce.productDescription(),
			totalAmountInCents: faker.number.int({ min: 100, max: 100_000 }),
			currency: makeCurrency(),
			date: faker.date.recent(),
			split: {
				kind: 'equally',
				slices: [EqualSlice.create(u1), EqualSlice.create(u2)],
			},
			...override,
		},
		args
	)
}
