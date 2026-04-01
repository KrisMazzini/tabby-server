import type { Friendship } from '@/domain/tabs/enterprise/entities/friendship'

export function toHttpFriendshipSerializer(friendship: Friendship) {
	return {
		id: friendship.id.toString(),
		fromUserId: friendship.fromUserId.toString(),
		toUserId: friendship.toUserId.toString(),
		status: friendship.status,
		createdAt: friendship.createdAt,
		updatedAt: friendship.updatedAt ?? null,
	}
}
