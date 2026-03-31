import type { MagicToken } from '../../enterprise/entities/magic-token'

export interface MagicTokensRepository {
	create(token: MagicToken): Promise<void>

	save(token: MagicToken): Promise<void>

	findById(id: string): Promise<MagicToken | null>
}
