import type { Expense } from '../../enterprise/entities/expense'

export interface ExpensesRepository {
	create(expense: Expense): Promise<void>

	save(expense: Expense): Promise<void>

	delete(expense: Expense): Promise<void>

	findById(id: string): Promise<Expense | null>
}
