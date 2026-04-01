import type { User } from '@/domain/iam/enterprise/entities/user'

export function toHttpUserSerializer(user: User) {
	return {
		id: user.id.toString(),
		name: user.name,
		email: user.email,
		dateOfBirth: user.dateOfBirth,
		createdAt: user.createdAt,
		updatedAt: user.updatedAt ?? null,
	}
}
