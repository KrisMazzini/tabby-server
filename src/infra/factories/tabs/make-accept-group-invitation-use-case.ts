import { AcceptGroupInvitationUseCase } from '@/domain/tabs/application/use-cases/accept-group-invitation-use-case'
import { PrismaGroupsRepository } from '@/infra/database/prisma/repositories/prisma-groups-repository'

export function makeAcceptGroupInvitationUseCase() {
	const groupsRepository = new PrismaGroupsRepository()
	return new AcceptGroupInvitationUseCase(groupsRepository)
}
