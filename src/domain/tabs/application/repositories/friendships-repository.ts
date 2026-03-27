import type { Friendship } from '../../enterprise/entities/friendship'

export interface FriendshipsRepository {
	create(friendship: Friendship): Promise<void>

	save(friendship: Friendship): Promise<void>

	delete(friendship: Friendship): Promise<void>

	findById(id: string): Promise<Friendship | null>

	findByBothUserIds(
		firstUserId: string,
		secondUserId: string
	): Promise<Friendship | null>

	findManyByUserId(userId: string): Promise<Friendship[]>
}
