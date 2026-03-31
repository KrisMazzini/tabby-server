import type { PaginationMeta } from '@/core/pagination/pagination'

import type { Expense } from '../../enterprise/entities/expense'
import type {
	ExpensesListFilters,
	ExpensesRepository,
} from '../repositories/expenses-repository'

export interface ListExpensesUseCaseRequest {
	userId: string
	page?: number
	size?: number
	filters?: ExpensesListFilters
}

export interface ListExpensesUseCaseResponse {
	expenses: Expense[]
	meta: PaginationMeta
}

export class ListExpensesUseCase {
	constructor(private expensesRepository: ExpensesRepository) {}

	async execute({
		userId,
		page = 1,
		size = 20,
		filters,
	}: ListExpensesUseCaseRequest): Promise<ListExpensesUseCaseResponse> {
		const { items, meta } = await this.expensesRepository.findManyByUserId(
			userId,
			{
				page,
				size,
			},
			filters
		)

		return { expenses: items, meta }
	}
}
