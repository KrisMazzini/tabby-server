import { Entity, type EntityArgs } from '@/core/entities/entity'
import type { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'

import { InvalidAmountError } from '../../errors/invalid-amount-error'
import { SelfPaymentError } from '../../errors/self-payment-error'
import type { Currency } from '../value-objects/currency'

export interface PaymentProps {
	payerId: UniqueEntityId
	receiverId: UniqueEntityId
	amountInCents: number
	currency: Currency
	date: Date
	groupId?: UniqueEntityId
}

export class Payment extends Entity<PaymentProps> {
	get payerId() {
		return this.props.payerId
	}

	get receiverId() {
		return this.props.receiverId
	}

	get amountInCents() {
		return this.props.amountInCents
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

	set amountInCents(amountInCents: PaymentProps['amountInCents']) {
		if (amountInCents <= 0) {
			throw new InvalidAmountError()
		}

		this.props.amountInCents = amountInCents
		this.touch()
	}

	set currency(currency: PaymentProps['currency']) {
		this.props.currency = currency
		this.touch()
	}

	set date(date: PaymentProps['date']) {
		this.props.date = date
		this.touch()
	}

	set groupId(groupId: PaymentProps['groupId']) {
		this.props.groupId = groupId
		this.touch()
	}

	static create(props: PaymentProps, args?: EntityArgs) {
		if (props.amountInCents <= 0) {
			throw new InvalidAmountError()
		}

		if (props.payerId.equals(props.receiverId)) {
			throw new SelfPaymentError()
		}

		return new Payment(props, args)
	}
}
