import type {
	PaginatedResult,
	PaginationParams,
} from '@/core/pagination/pagination'

import type { Payment } from '../../enterprise/entities/payment'

export interface PaymentsListFilters {
	role?: 'payer' | 'receiver'
	groupId?: string
}

export interface PaymentsRepository {
	create(payment: Payment): Promise<void>

	save(payment: Payment): Promise<void>

	delete(payment: Payment): Promise<void>

	findById(id: string): Promise<Payment | null>

	findManyByUserId(
		userId: string,
		pagination: PaginationParams,
		filters?: PaymentsListFilters
	): Promise<PaginatedResult<Payment>>
}
