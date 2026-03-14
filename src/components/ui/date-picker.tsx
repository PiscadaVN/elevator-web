import { format as formatDate } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface DatePickerProps {
	date?: Date
	format?: string
	placeholder?: string
	buttonClassName?: string
	disabled?: React.ComponentProps<typeof Calendar>['disabled']
	onDateChange: (date?: Date) => void
}

export function DatePicker({
	date,
	format = 'dd/MM/yyyy',
	placeholder = 'DD/MM/YYYY',
	buttonClassName,
	disabled,
	onDateChange,
}: Readonly<DatePickerProps>) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					data-empty={!date}
					className={cn(
						'w-full justify-start text-left font-normal data-[empty=true]:text-muted-foreground',
						buttonClassName,
					)}
				>
					<CalendarIcon />
					{date ? formatDate(date, format) : <span>{placeholder}</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0">
				<Calendar required={true} mode="single" selected={date} onSelect={onDateChange} disabled={disabled} />
			</PopoverContent>
		</Popover>
	)
}
