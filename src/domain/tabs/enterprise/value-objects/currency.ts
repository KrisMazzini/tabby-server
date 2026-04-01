export interface CurrencyProps {
	iso: string
	name?: string
	symbol?: string
}

export class Currency {
	private readonly props: CurrencyProps

	private constructor(props: CurrencyProps) {
		this.props = props
	}

	get iso() {
		return this.props.iso
	}

	get name() {
		return this.props.name
	}

	get symbol() {
		return this.props.symbol
	}

	equals(other: Currency) {
		return this.props.iso === other.props.iso
	}

	static create(props: CurrencyProps) {
		return new Currency({
			...props,
			iso: props.iso.toUpperCase(),
		})
	}
}
