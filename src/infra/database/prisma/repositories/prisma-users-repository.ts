import type { UsersRepository } from '@/domain/iam/application/repositories/users-repository'
import type { User } from '@/domain/iam/enterprise/entities/user'
import { prisma } from '@/lib/prisma'

import { toDomainUser, toPrismaUser } from '../mappers/prisma-user-mapper'

export class PrismaUsersRepository implements UsersRepository {
	async create(user: User): Promise<void> {
		const prismaUser = toPrismaUser(user)

		await prisma.user.create({
			data: prismaUser,
		})
	}

	async save(user: User): Promise<void> {
		const prismaUser = toPrismaUser(user)

		await prisma.user.update({
			where: { id: prismaUser.id },
			data: prismaUser,
		})
	}

	async delete(user: User): Promise<void> {
		await prisma.user.delete({
			where: { id: user.id.toString() },
		})
	}

	async findById(id: string): Promise<User | null> {
		const user = await prisma.user.findUnique({
			where: { id },
		})

		return user ? toDomainUser(user) : null
	}

	async findByEmail(email: string): Promise<User | null> {
		const user = await prisma.user.findUnique({
			where: { email },
		})

		return user ? toDomainUser(user) : null
	}
}
