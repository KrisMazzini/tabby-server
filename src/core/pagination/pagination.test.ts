import { paginateInMemory } from './pagination'

describe('Core | pagination', () => {
	describe('paginateInMemory', () => {
		it('returns empty meta for empty input', () => {
			const result = paginateInMemory([], { page: 1, size: 20 })

			expect(result.items).toEqual([])
			expect(result.meta).toEqual({
				page: 1,
				size: 20,
				itemCount: 0,
				totalItems: 0,
				totalPages: 0,
			})
		})

		it('slices a page and computes totals', () => {
			const all = [1, 2, 3, 4, 5]
			const result = paginateInMemory(all, { page: 2, size: 2 })

			expect(result.items).toEqual([3, 4])
			expect(result.meta).toEqual({
				page: 2,
				size: 2,
				itemCount: 2,
				totalItems: 5,
				totalPages: 3,
			})
		})

		it('returns fewer items on the last page if the page size does not divide the total number of items', () => {
			const all = [1, 2, 3]
			const result = paginateInMemory(all, { page: 2, size: 2 })

			expect(result.items).toEqual([3])
			expect(result.meta.itemCount).toBe(1)
			expect(result.meta.totalPages).toBe(2)
		})

		it('returns an empty page when page is beyond the last page', () => {
			const all = [1, 2]
			const result = paginateInMemory(all, { page: 5, size: 2 })

			expect(result.items).toEqual([])
			expect(result.meta.itemCount).toBe(0)
			expect(result.meta.totalItems).toBe(2)
			expect(result.meta.totalPages).toBe(1)
		})
	})
})
