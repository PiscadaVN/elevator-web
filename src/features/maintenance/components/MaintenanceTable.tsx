import { Check, ChevronDown, Edit, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
	canTransitionMaintenanceStatus,
	getMaintenanceStatusLabel,
	getNextMaintenanceStatuses,
	MAINTENANCE_STATUS_STYLES,
} from '@/features/maintenance/helpers/status'
import { useElevators, useUpdateMaintenanceSchedule } from '@/hooks/api'
import { useLanguage } from '@/i18n/LanguageContext'
import { formatDisplayDate } from '@/lib/date-utils'
import { cn } from '@/lib/utils'
import type { MaintenanceSchedule, MaintenanceStatus } from '@/types/api'

interface MaintenanceTableProps {
	schedules: MaintenanceSchedule[]
	isLoading: boolean
	onEdit: (schedule: MaintenanceSchedule) => void
	onDelete: (id: string) => void
}

interface StatusCellProps {
	schedule: MaintenanceSchedule
	onUpdateStatus: (id: string, status: MaintenanceStatus) => void
}

function MaintenanceStatusCell({ schedule, onUpdateStatus }: Readonly<StatusCellProps>) {
	const { t } = useLanguage()
	const [open, setOpen] = useState(false)

	const currentStatus = schedule.status
	const nextStatuses = getNextMaintenanceStatuses(currentStatus)
	const isDisabled = nextStatuses.length <= 1
	const style = MAINTENANCE_STATUS_STYLES[currentStatus]
	const { Icon } = style

	return (
		<div className="flex items-center gap-2">
			<div
				className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', style.iconBg, style.iconColor)}
			>
				<Icon className="w-4 h-4" />
			</div>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						type="button"
						variant="ghost"
						disabled={isDisabled}
						className={cn(
							'inline-flex items-center gap-1 py-1 pl-2.5 pr-2 rounded-full text-xs font-bold border whitespace-nowrap',
							'transition-all select-none',
							style.pillBg,
							style.pillText,
							style.pillBorder,
							isDisabled ? 'cursor-default' : 'cursor-pointer hover:brightness-95 active:brightness-90',
						)}
					>
						{getMaintenanceStatusLabel(currentStatus, t)}
						{!isDisabled && (
							<ChevronDown
								className={cn('w-3 h-3 opacity-65 transition-transform duration-200', open && 'rotate-180')}
							/>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent
					align="start"
					sideOffset={6}
					className="z-50 bg-white border border-gray-200 rounded-xl p-1.5 shadow-xl min-w-44 w-auto"
				>
					{nextStatuses.map((status) => {
						const s = MAINTENANCE_STATUS_STYLES[status]
						const SIcon = s.Icon
						return (
							<Button
								key={status}
								type="button"
								variant="ghost"
								onClick={() => {
									onUpdateStatus(schedule.id, status)
									setOpen(false)
								}}
								className={cn(
									'flex items-center gap-2 w-full px-2 py-1.5 rounded-lg text-xs font-bold text-gray-700',
									'hover:bg-gray-50 cursor-pointer transition-colors text-left',
									status === currentStatus && 'bg-gray-50',
								)}
							>
								<div
									className={cn('w-6 h-6 rounded-md flex items-center justify-center shrink-0', s.iconBg, s.iconColor)}
								>
									<SIcon className="w-3.5 h-3.5" />
								</div>
								<span className="flex-1">{getMaintenanceStatusLabel(status, t)}</span>
								{status === currentStatus && <Check className="w-3 h-3 text-emerald-500" />}
							</Button>
						)
					})}
				</PopoverContent>
			</Popover>
		</div>
	)
}

export function MaintenanceTable({ schedules, isLoading, onEdit, onDelete }: Readonly<MaintenanceTableProps>) {
	const { t } = useLanguage()

	const updateMutation = useUpdateMaintenanceSchedule()
	const { data: elevators = [] } = useElevators()

	const handleUpdateStatus = async (id: string, status: MaintenanceStatus) => {
		try {
			const schedule = schedules.find((item) => item.id === id)
			if (!schedule) {
				return
			}

			if (!canTransitionMaintenanceStatus(schedule.status, status)) {
				toast.warning(t('invalidMaintenanceStatusTransition'))
				return
			}

			await updateMutation.mutateAsync({
				scheduleId: id,
				data: { ...schedule, status },
			})
		} catch {
			// Handled by mutation hook toast.
		}
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>{t('maintenance')}</CardTitle>
				<CardDescription>{t('maintenanceListDesc')}</CardDescription>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<div className="text-center py-8 text-muted-foreground">{t('loadingMaintenanceSchedules')}</div>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>{t('elevator')}</TableHead>

								<TableHead>{t('scheduledAt')}</TableHead>

								<TableHead>{t('lastUpdated')}</TableHead>

								<TableHead>{t('assignedOperator')}</TableHead>

								<TableHead>{t('status')}</TableHead>

								<TableHead>{t('note')}</TableHead>

								<TableHead className="text-right">{t('actions')}</TableHead>
							</TableRow>
						</TableHeader>

						<TableBody>
							{schedules.length === 0 ? (
								<TableRow>
									<TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
										{t('noMaintenanceSchedulesFound')}
									</TableCell>
								</TableRow>
							) : (
								schedules.map((schedule) => {
									const elevator = elevators.find((e) => e.id === schedule.elevatorId)

									const operator =
										schedule.assignedOperator ?? elevator?.operators?.find((o) => o.id === schedule.assignedOperatorId)

									return (
										<TableRow key={schedule.id}>
											<TableCell className="font-bold">{schedule.elevator?.code ?? t('notAvailable')}</TableCell>

											<TableCell>{formatDisplayDate(schedule.scheduledStartAt)}</TableCell>

											<TableCell>{formatDisplayDate(schedule.updatedAt)}</TableCell>

											<TableCell>
												{operator ? (
													<div className="flex items-center gap-2">
														<div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-[9px] font-extrabold shrink-0">
															{operator.fullName
																.split(' ')
																.map((n) => n[0])
																.join('')
																.slice(0, 2)
																.toUpperCase()}
														</div>
														<span className="text-sm font-semibold text-gray-700">{operator.fullName}</span>
													</div>
												) : (
													<span className="text-xs text-gray-400 italic font-medium">{t('unassigned')}</span>
												)}
											</TableCell>

											<TableCell>
												<MaintenanceStatusCell schedule={schedule} onUpdateStatus={handleUpdateStatus} />
											</TableCell>

											<TableCell className="max-w-xs truncate text-sm text-gray-500">
												{schedule.notes || t('notAvailable')}
											</TableCell>

											<TableCell className="text-right">
												<div className="flex items-center justify-end gap-1.5">
													<Button
														variant="ghost"
														size="icon"
														className="w-8 h-8 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 text-gray-500"
														onClick={() => onEdit(schedule)}
													>
														<Edit className="w-3.5 h-3.5" />
													</Button>
													<Button
														variant="ghost"
														size="icon"
														className="w-8 h-8 rounded-lg border border-gray-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600 text-gray-500"
														onClick={() => onDelete(schedule.id)}
													>
														<Trash2 className="w-3.5 h-3.5" />
													</Button>
												</div>
											</TableCell>
										</TableRow>
									)
								})
							)}
						</TableBody>
					</Table>
				)}
			</CardContent>
		</Card>
	)
}
