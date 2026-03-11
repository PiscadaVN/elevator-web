import { Check, ChevronsUpDown, X } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

export interface MultiSelectOption {
	label: string
	value: string
}

interface MultiSelectProps {
	value: string[]
	onValueChange: (value: string[]) => void
	options: MultiSelectOption[]
	placeholder: string
	searchPlaceholder: string
	emptyText: string
	className?: string
	disabled?: boolean
}

export function MultiSelect({
	value,
	onValueChange,
	options,
	placeholder,
	searchPlaceholder,
	emptyText,
	className,
	disabled,
}: MultiSelectProps) {
	const toggleValue = (nextValue: string) => {
		if (value.includes(nextValue)) {
			onValueChange(value.filter((item) => item !== nextValue))
			return
		}

		onValueChange([...value, nextValue])
	}

	const removeValue = (nextValue: string) => {
		onValueChange(value.filter((item) => item !== nextValue))
	}

	const selectedOptions = options.filter((option) => value.includes(option.value))

	return (
		<Popover>
			<PopoverTrigger asChild>
				<div
					tabIndex={disabled ? -1 : 0}
					role="combobox"
					aria-expanded="false"
					aria-disabled={disabled}
					className={cn(
						buttonVariants({ variant: 'outline' }),
						'h-auto min-h-9 w-full cursor-pointer justify-between',
						disabled && 'pointer-events-none opacity-50',
						className,
					)}
				>
					{selectedOptions.length > 0 ? (
						<div className="flex flex-wrap items-center gap-1">
							{selectedOptions.map((option) => (
								<Badge key={option.value} variant="secondary" className="flex items-center gap-1">
									{option.label}
									<button
										type="button"
										onClick={(event) => {
											event.stopPropagation()
											removeValue(option.value)
										}}
										className="rounded-sm opacity-70 transition-opacity hover:opacity-100"
									>
										<X className="h-3 w-3" />
									</button>
								</Badge>
							))}
						</div>
					) : (
						<span className="text-muted-foreground">{placeholder}</span>
					)}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</div>
			</PopoverTrigger>
			<PopoverContent align="start" className="p-0" style={{ width: 'var(--radix-popover-trigger-width)' }}>
				<Command>
					<CommandInput placeholder={searchPlaceholder} />
					<CommandList>
						<CommandEmpty>{emptyText}</CommandEmpty>
						<CommandGroup>
							{options.map((option) => (
								<CommandItem key={option.value} value={option.label} onSelect={() => toggleValue(option.value)}>
									<Check className={cn('h-4 w-4', value.includes(option.value) ? 'opacity-100' : 'opacity-0')} />
									{option.label}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}
