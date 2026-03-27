export interface PaginationParams {
	page: number
	size: number
}

export interface PaginationMeta {
	page: number
	size: number
	itemCount: number
	totalItems: number
	totalPages: number
}

export interface PaginatedResult<T> {
	items: T[]
	meta: PaginationMeta
}

export function paginateInMemory<T>(
	allItems: T[],
	params: PaginationParams
): PaginatedResult<T> {
	const { page, size } = params
	const totalItems = allItems.length
	const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / size)
	const start = (page - 1) * size
	const items = allItems.slice(start, start + size)

	return {
		items,
		meta: {
			page,
			size,
			itemCount: items.length,
			totalItems,
			totalPages,
		},
	}
}
