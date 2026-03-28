import type { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'

export function assertUniqueUserIds(ids: UniqueEntityId[]): boolean {
	const seen = new Set<string>()
	for (const id of ids) {
		const key = id.toValue()
		if (seen.has(key)) {
			return false
		}
		seen.add(key)
	}

	return true
}
