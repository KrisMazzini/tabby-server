import type {
	PaginationMeta,
	PaginationParams,
} from '@/core/pagination/pagination'
import type { Payment } from '../../enterprise/entities/payment'
import type {
	PaymentsListFilters,
	PaymentsRepository,
} from '../repositories/payments-repository'

export interface ListPaymentsUseCaseRequest {
	userId: string
	page?: number
	size?: number
	filters?: PaymentsListFilters
}

export interface ListPaymentsUseCaseResponse {
	payments: Payment[]
	meta: PaginationMeta
}

export class ListPaymentsUseCase {
	constructor(private paymentsRepository: PaymentsRepository) {}

	async execute({
		userId,
		page = 1,
		size = 20,
		filters,
	}: ListPaymentsUseCaseRequest): Promise<ListPaymentsUseCaseResponse> {
		const pagination: PaginationParams = { page, size }

		const { items, meta } = await this.paymentsRepository.findManyByUserId(
			userId,
			pagination,
			filters
		)

		return { payments: items, meta }
	}
}
