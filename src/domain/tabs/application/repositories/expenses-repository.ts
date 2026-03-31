import type {
	PaginatedResult,
	PaginationParams,
} from '@/core/pagination/pagination'

import type { Expense } from '../../enterprise/entities/expense'

export interface ExpensesListFilters {
	groupId?: string
	friendId?: string
}

export interface ExpensesRepository {
	create(expense: Expense): Promise<void>

	save(expense: Expense): Promise<void>

	delete(expense: Expense): Promise<void>

	findById(id: string): Promise<Expense | null>

	findManyByUserId(
		userId: string,
		pagination: PaginationParams,
		filters?: ExpensesListFilters
	): Promise<PaginatedResult<Expense>>
}
