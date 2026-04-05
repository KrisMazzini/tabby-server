import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

import { Currency } from '@/domain/tabs/enterprise/value-objects/currency'
import { makeUpdateExpenseUseCase } from '@/infra/factories/tabs/make-update-expense-use-case'
import { toHttpExpenseSerializer } from '@/infra/http/serializers/expense-serializer'

export async function update(request: FastifyRequest, reply: FastifyReply) {
	const updateExpenseBodySchema = z.object({
		payerId: z.string(),
		description: z.string().trim().min(1),
		currencyIso: z.string().min(3).max(3),
		totalAmountInCents: z.number().int().positive(),
		date: z.iso.datetime().transform(date => new Date(date)),
		groupId: z.string().optional(),
		split: z.object({
			kind: z.enum(['equally', 'byPercentage', 'byShares', 'byFixedAmounts']),
			slices: z.array(
				z.object({
					userId: z.string(),
					amountInCents: z.number().int().positive().optional(),
					percentage: z.number().int().positive().optional(),
					shares: z.number().int().positive().optional(),
				})
			),
		}),
	})

	const updateExpenseParamsSchema = z.object({
		expenseId: z.string(),
	})

	const {
		payerId,
		description,
		currencyIso,
		totalAmountInCents,
		date,
		groupId,
		split,
	} = updateExpenseBodySchema.parse(request.body)

	const { expenseId } = updateExpenseParamsSchema.parse(request.params)

	const updateExpenseUseCase = makeUpdateExpenseUseCase()

	const { expense } = await updateExpenseUseCase.execute({
		expenseId,
		userId: request.user.sub,
		payerId,
		description,
		currency: Currency.create({ iso: currencyIso }),
		totalAmountInCents,
		date,
		groupId,
		split,
	})

	return reply.status(200).send({
		expense: toHttpExpenseSerializer(expense),
	})
}
