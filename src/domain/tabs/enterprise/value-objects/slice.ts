import type { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'

import { InvalidFixedSliceError } from '../../errors/invalid-fixed-slice-error'
import { InvalidPercentageSliceError } from '../../errors/invalid-percentage-slice-error'
import { InvalidSharesSliceError } from '../../errors/invalid-shares-slice-error'

export abstract class Slice<Props> {
	private _userId: UniqueEntityId

	get userId() {
		return this._userId
	}

	protected constructor(
		userId: UniqueEntityId,
		protected props: Props
	) {
		this._userId = userId
		this.props = props
	}
}

type EqualSliceProps = null

export class EqualSlice extends Slice<EqualSliceProps> {
	static create(userId: UniqueEntityId) {
		return new EqualSlice(userId, null)
	}
}

export interface PercentageSliceProps {
	percentage: number
}

export class PercentageSlice extends Slice<PercentageSliceProps> {
	get percentage() {
		return this.props.percentage
	}

	static create(userId: UniqueEntityId, props: PercentageSliceProps) {
		if (props.percentage < 0 || props.percentage > 100) {
			throw new InvalidPercentageSliceError()
		}

		return new PercentageSlice(userId, props)
	}
}

export interface SharesSliceProps {
	shares: number
}

export class SharesSlice extends Slice<SharesSliceProps> {
	get shares() {
		return this.props.shares
	}

	static create(userId: UniqueEntityId, props: SharesSliceProps) {
		if (props.shares < 0) {
			throw new InvalidSharesSliceError()
		}

		return new SharesSlice(userId, props)
	}
}

export interface FixedSliceProps {
	amountInCents: number
}

export class FixedSlice extends Slice<FixedSliceProps> {
	get amountInCents() {
		return this.props.amountInCents
	}

	static create(userId: UniqueEntityId, props: FixedSliceProps) {
		if (props.amountInCents < 0) {
			throw new InvalidFixedSliceError()
		}

		return new FixedSlice(userId, props)
	}
}

export type Split =
	| { kind: 'equally'; slices: EqualSlice[] }
	| { kind: 'byPercentage'; slices: PercentageSlice[] }
	| { kind: 'byShares'; slices: SharesSlice[] }
	| { kind: 'byFixedAmounts'; slices: FixedSlice[] }
