import { Entity, type EntityArgs } from '@/core/entities/entity'
import type { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'

import { validateSplit } from '../../validators/validate-split'

import type { Currency } from '../value-objects/currency'
import type { Split } from '../value-objects/slice'

export interface ExpenseProps {
	payerId: UniqueEntityId
	description: string
	currency: Currency
	totalAmountInCents: number
	date: Date
	groupId?: UniqueEntityId
	split: Split
}

export class Expense extends Entity<ExpenseProps> {
	get payerId() {
		return this.props.payerId
	}

	get description() {
		return this.props.description
	}

	get totalAmountInCents() {
		return this.props.totalAmountInCents
	}

	get currency() {
		return this.props.currency
	}

	get date() {
		return this.props.date
	}

	get groupId() {
		return this.props.groupId
	}

	get split() {
		return this.props.split
	}

	set payerId(payerId: ExpenseProps['payerId']) {
		this.props.payerId = payerId
		this.touch()
	}

	set description(description: ExpenseProps['description']) {
		this.props.description = description
		this.touch()
	}

	set currency(currency: ExpenseProps['currency']) {
		this.props.currency = currency
		this.touch()
	}

	set date(date: ExpenseProps['date']) {
		this.props.date = date
		this.touch()
	}

	set groupId(groupId: ExpenseProps['groupId']) {
		this.props.groupId = groupId
		this.touch()
	}

	public redistribute(totalAmountInCents: number, split: Split) {
		validateSplit(totalAmountInCents, split)

		this.props.split = split
		this.props.totalAmountInCents = totalAmountInCents
		this.touch()
	}

	static create(props: ExpenseProps, args?: EntityArgs) {
		validateSplit(props.totalAmountInCents, props.split)

		return new Expense(props, args)
	}
}
