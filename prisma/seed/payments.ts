import { faker } from '@faker-js/faker'

import type { User } from '@/domain/iam/enterprise/entities/user'
import { makePayment } from '@/domain/tabs/tests/factories/make-payment'
import { PrismaPaymentsRepository } from '@/infra/database/prisma/repositories/prisma-payments-repository'

export async function seedPayments(users: User[]) {
	if (users.length < 2) {
		return
	}

	const paymentsRepository = new PrismaPaymentsRepository()

	const pairs: [User, User][] = []
	for (let i = 0; i < users.length; i++) {
		for (let j = i + 1; j < users.length; j++) {
			pairs.push([users[i], users[j]])
		}
	}

	faker.helpers.shuffle(pairs)

	const payments = pairs
		.slice(0, Math.min(30, pairs.length))
		.flatMap(([u1, u2]) => {
			return Array.from({ length: faker.number.int({ min: 1, max: 5 }) }).map(
				() => {
					const [fromUser, toUser] = faker.helpers.arrayElement([
						[u1, u2],
						[u2, u1],
					])

					return makePayment({
						payerId: fromUser.id,
						receiverId: toUser.id,
					})
				}
			)
		})

	return await Promise.all(
		payments.map(payment => paymentsRepository.create(payment))
	)
}
