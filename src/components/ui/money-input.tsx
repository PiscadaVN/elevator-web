import * as React from 'react'

import { Input } from '@/components/ui/input'

interface MoneyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'type'> {
	value?: number | null
	defaultValue?: number | null
	onValueChange?: (value: number) => void
	locale?: string
	currency?: string
	allowDecimal?: boolean
}

const MoneyInput = React.forwardRef<HTMLInputElement, MoneyInputProps>(
	(
		{
			className,
			value,
			defaultValue,
			onValueChange,
			onChange,
			onFocus,
			onBlur,
			locale = 'vi-VN',
			currency = 'VND',
			allowDecimal = false,
			...props
		},
		ref,
	) => {
		const separators = React.useMemo(() => {
			const parts = new Intl.NumberFormat(locale).formatToParts(1234567.89)
			const group = parts.find((part) => part.type === 'group')?.value ?? '.'
			const decimal = parts.find((part) => part.type === 'decimal')?.value ?? ','
			return { group, decimal }
		}, [locale])

		const formatter = React.useMemo(
			() =>
				new Intl.NumberFormat(locale, {
					style: 'currency',
					currency,
					maximumFractionDigits: allowDecimal ? 2 : 0,
					minimumFractionDigits: allowDecimal ? 2 : 0,
				}),
			[currency, locale, allowDecimal],
		)

		const toDisplayValue = React.useCallback(
			(amount?: number | null) => {
				if (typeof amount !== 'number' || Number.isNaN(amount)) return ''
				return formatter.format(amount)
			},
			[formatter],
		)

		const toRawValue = React.useCallback(
			(amount?: number | null) => {
				if (typeof amount !== 'number' || Number.isNaN(amount)) return ''
				if (allowDecimal) {
					return String(Math.round(amount * 100))
				}

				return String(Math.round(amount))
			},
			[allowDecimal],
		)

		const formatRawValueForInput = React.useCallback(
			(digits: string) => {
				if (!digits) return ''

				if (!allowDecimal) {
					return digits.replaceAll(/\B(?=(\d{3})+(?!\d))/g, separators.group)
				}

				const padded = digits.padStart(3, '0')
				const integerDigits = padded.slice(0, -2).replace(/^0+(?=\d)/, '') || '0'
				const fractionDigits = padded.slice(-2)
				const groupedInteger = integerDigits.replaceAll(/\B(?=(\d{3})+(?!\d))/g, separators.group)

				return `${groupedInteger}${separators.decimal}${fractionDigits}`
			},
			[allowDecimal, separators.decimal, separators.group],
		)

		const [rawValue, setRawValue] = React.useState<string>(() => toRawValue(value ?? defaultValue))
		const [isFocused, setIsFocused] = React.useState(false)

		React.useEffect(() => {
			if (value === undefined) return
			setRawValue(toRawValue(value))
		}, [toRawValue, value])

		const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
			const digits = event.target.value.replaceAll(/\D/g, '')
			setRawValue(digits)

			let amount = 0
			if (digits) {
				amount = allowDecimal ? Number(digits) / 100 : Number(digits)
			}
			onValueChange?.(amount)
			onChange?.(event)
		}

		const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
			setIsFocused(true)
			onFocus?.(event)
		}

		const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
			setIsFocused(false)
			onBlur?.(event)
		}

		let amount: number | undefined
		if (rawValue) {
			amount = allowDecimal ? Number(rawValue) / 100 : Number(rawValue)
		}
		const displayValue = isFocused ? formatRawValueForInput(rawValue) : toDisplayValue(amount)

		return (
			<Input
				ref={ref}
				type="text"
				inputMode="numeric"
				value={displayValue}
				onChange={handleChange}
				onFocus={handleFocus}
				onBlur={handleBlur}
				placeholder={props.placeholder ?? toDisplayValue(0)}
				className={className}
				{...props}
			/>
		)
	},
)

MoneyInput.displayName = 'MoneyInput'

export { MoneyInput }
