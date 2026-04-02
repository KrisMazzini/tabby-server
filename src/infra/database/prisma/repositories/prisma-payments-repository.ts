import type { Prisma } from 'generated/prisma/client'
import type { PaginationParams } from '@/core/pagination/pagination'
import type {
	PaymentsListFilters,
	PaymentsRepository,
} from '@/domain/tabs/application/repositories/payments-repository'
import type { Payment } from '@/domain/tabs/enterprise/entities/payment'
import { prisma } from '@/lib/prisma'
import {
	toDomainPayment,
	toPrismaPayment,
} from '../mappers/prisma-payments-mapper'

export class PrismaPaymentsRepository implements PaymentsRepository {
	async create(payment: Payment) {
		const prismaPayment = toPrismaPayment(payment)

		await prisma.payment.create({
			data: prismaPayment,
		})
	}

	async save(payment: Payment) {
		const prismaPayment = toPrismaPayment(payment)

		await prisma.payment.update({
			where: { id: prismaPayment.id },
			data: prismaPayment,
		})
	}

	async delete(payment: Payment) {
		await prisma.payment.delete({
			where: { id: payment.id.toString() },
		})
	}

	async findById(id: string) {
		const prismaPayment = await prisma.payment.findUnique({
			where: { id },
		})

		return prismaPayment ? toDomainPayment(prismaPayment) : null
	}

	async findManyByUserId(
		userId: string,
		pagination: PaginationParams,
		filters?: PaymentsListFilters
	) {
		let userOrFilter: Prisma.PaymentWhereInput['OR'] = [
			{ payerId: userId },
			{ receiverId: userId },
		]

		if (filters?.role === 'payer') {
			userOrFilter = [{ payerId: userId }]
		}

		if (filters?.role === 'receiver') {
			userOrFilter = [{ receiverId: userId }]
		}

		const friendOrFilter: Prisma.PaymentWhereInput['OR'] | undefined =
			filters?.friendId
				? [{ payerId: filters?.friendId }, { receiverId: filters?.friendId }]
				: undefined

		const where: Prisma.PaymentWhereInput = {
			AND: [
				{
					OR: userOrFilter,
				},
				{
					OR: friendOrFilter,
				},
			],
			groupId: filters?.groupId,
		}

		const payments = await prisma.payment.findMany({
			where,
			take: pagination.size,
			skip: (pagination.page - 1) * pagination.size,
		})

		const totalItems = await prisma.payment.count({
			where,
		})

		return {
			items: payments.map(toDomainPayment),
			meta: {
				page: pagination.page,
				size: pagination.size,
				itemCount: payments.length,
				totalItems,
				totalPages:
					pagination.size === 0 ? 0 : Math.ceil(totalItems / pagination.size),
			},
		}
	}
}
