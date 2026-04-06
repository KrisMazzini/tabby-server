import { faker } from '@faker-js/faker'

import type { User } from '@/domain/iam/enterprise/entities/user'
import { EqualSlice } from '@/domain/tabs/enterprise/value-objects/slice'
import { makeExpense } from '@/domain/tabs/tests/factories/make-expense'
import { PrismaExpensesRepository } from '@/infra/database/prisma/repositories/prisma-expenses-repository'

export async function seedExpenses(users: User[]) {
	if (users.length < 2) {
		return
	}

	const expensesRepository = new PrismaExpensesRepository()

	const pairs: [User, User][] = []
	for (let i = 0; i < users.length; i++) {
		for (let j = i + 1; j < users.length; j++) {
			pairs.push([users[i], users[j]])
		}
	}

	faker.helpers.shuffle(pairs)

	const expenses = pairs
		.slice(0, Math.min(30, pairs.length))
		.flatMap(([u1, u2]) => {
			return Array.from({ length: faker.number.int({ min: 1, max: 5 }) }).map(
				() => {
					const [payerUser, borrowerUser] = faker.helpers.arrayElement([
						[u1, u2],
						[u2, u1],
					])

					return makeExpense({
						payerId: payerUser.id,
						split: {
							kind: 'equally',
							slices: [
								EqualSlice.create(payerUser.id),
								EqualSlice.create(borrowerUser.id),
							],
						},
					})
				}
			)
		})

	return await Promise.all(
		expenses.map(expense => expensesRepository.create(expense))
	)
}
