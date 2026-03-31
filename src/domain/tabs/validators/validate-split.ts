import { assertUniqueUserIds } from '@/utils/assert-unique-ids'

import type { Split } from '../enterprise/value-objects/slice'
import { DuplicateUserInSplitError } from '../errors/duplicate-user-in-split-error'
import { EmptySplitSlicesError } from '../errors/empty-split-slices-error'
import { FixedSplitTotalMismatchError } from '../errors/fixed-split-total-mismatch-error'
import { InvalidAmountError } from '../errors/invalid-amount-error'
import { PercentageSplitSumError } from '../errors/percentage-split-sum-error'
import { SharesSplitError } from '../errors/shares-split-error'

export function validateSplit(totalAmountInCents: number, split: Split) {
	if (totalAmountInCents <= 0) {
		throw new InvalidAmountError()
	}

	const slices = split.slices

	if (slices.length === 0) {
		throw new EmptySplitSlicesError()
	}

	const areUsersUnique = assertUniqueUserIds(slices.map(s => s.userId))

	if (!areUsersUnique) {
		throw new DuplicateUserInSplitError()
	}

	switch (split.kind) {
		case 'equally':
			break

		case 'byPercentage': {
			const sum = split.slices.reduce((acc, s) => acc + s.percentage, 0)
			if (sum !== 100) {
				throw new PercentageSplitSumError()
			}

			break
		}

		case 'byShares': {
			const totalShares = split.slices.reduce((acc, s) => acc + s.shares, 0)
			if (totalShares <= 0) {
				throw new SharesSplitError()
			}

			break
		}

		case 'byFixedAmounts': {
			const sum = split.slices.reduce((acc, s) => acc + s.amountInCents, 0)
			if (sum !== totalAmountInCents) {
				throw new FixedSplitTotalMismatchError()
			}

			break
		}
	}
}
