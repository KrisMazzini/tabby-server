import { InviteMemberUseCase } from '@/domain/tabs/application/use-cases/invite-member-use-case'
import { PrismaGroupsRepository } from '@/infra/database/prisma/repositories/prisma-groups-repository'

export function makeInviteMemberUseCase() {
	const groupsRepository = new PrismaGroupsRepository()
	return new InviteMemberUseCase(groupsRepository)
}
