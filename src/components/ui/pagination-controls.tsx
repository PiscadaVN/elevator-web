import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useLanguage } from '@/i18n/LanguageContext'
import { cn } from '@/lib/utils'

interface PaginationControlsProps {
	currentPage: number
	totalItems: number
	pageSize: number
	onPageChange: (page: number) => void
	className?: string
}

export function PaginationControls({
	currentPage,
	totalItems,
	pageSize,
	onPageChange,
	className,
}: Readonly<PaginationControlsProps>) {
	const { t } = useLanguage()

	if (totalItems <= 0) return null

	const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
	const startItem = (currentPage - 1) * pageSize + 1
	const endItem = Math.min(totalItems, currentPage * pageSize)

	return (
		<div className={cn('mt-4 flex items-center justify-between gap-3', className)}>
			<p className="text-[12px] font-medium text-muted-foreground">
				{t('paginationShowing')} {startItem}-{endItem} {t('paginationOf')} {totalItems}
			</p>

			<div className="flex items-center gap-2">
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={() => onPageChange(Math.max(1, currentPage - 1))}
					disabled={currentPage <= 1}
					className="h-8 px-2.5"
				>
					<ChevronLeft className="w-3.5 h-3.5" />
					{t('paginationPrevious')}
				</Button>

				<span className="min-w-14 text-center text-[12px] font-semibold text-foreground">
					{currentPage}/{totalPages}
				</span>

				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
					disabled={currentPage >= totalPages}
					className="h-8 px-2.5"
				>
					{t('paginationNext')}
					<ChevronRight className="w-3.5 h-3.5" />
				</Button>
			</div>
		</div>
	)
}
