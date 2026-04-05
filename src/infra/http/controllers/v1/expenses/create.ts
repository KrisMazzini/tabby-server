import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

import { Currency } from '@/domain/tabs/enterprise/value-objects/currency'
import { makeCreateExpenseUseCase } from '@/infra/factories/tabs/make-create-expense-use-case'
import { toHttpExpenseSerializer } from '@/infra/http/serializers/expense-serializer'

export async function create(request: FastifyRequest, reply: FastifyReply) {
	const createExpenseBodySchema = z.object({
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

	const {
		payerId,
		description,
		currencyIso,
		totalAmountInCents,
		date,
		groupId,
		split,
	} = createExpenseBodySchema.parse(request.body)

	const createExpenseUseCase = makeCreateExpenseUseCase()

	const { expense } = await createExpenseUseCase.execute({
		payerId,
		description,
		currency: Currency.create({ iso: currencyIso }),
		totalAmountInCents,
		date,
		groupId,
		split,
	})

	return reply.status(201).send({
		expense: toHttpExpenseSerializer(expense),
	})
}
