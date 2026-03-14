import { Check, ChevronDown, Edit, Eye, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
	getNextIncidentStatuses,
	getPriorityLabel,
	getStatusLabel,
	INCIDENT_STATUS_STYLES,
} from '@/features/incident/helpers/status-transition'
import { useLanguage } from '@/i18n/LanguageContext'
import { formatDisplayDate } from '@/lib/date-utils'
import { cn } from '@/lib/utils'
import type { Incident, IncidentStatus } from '@/types/api'

interface IncidentTableProps {
	incidents: Incident[]
	isLoading: boolean
	onView: (id: string) => void
	onEdit: (incident: Incident) => void
	onDelete: (id: string) => void
	onUpdateStatus: (id: string, status: IncidentStatus) => void
}

interface StatusCellProps {
	incident: Incident
	onUpdateStatus: (id: string, status: IncidentStatus) => void
}

function getUpdatedByLabel(incident: Incident, fallback: string) {
	if (!incident.updatedBy) {
		return fallback
	}

	if (typeof incident.updatedBy === 'string') {
		return incident.updatedBy
	}

	return incident.updatedBy.fullName || fallback
}

function getPriorityClasses(priority: number) {
	let priorityClass
	if (priority === 1) {
		priorityClass = 'bg-red-50 text-red-600 border-red-200'
	} else if (priority === 2) {
		priorityClass = 'bg-amber-50 text-amber-600 border-amber-200'
	} else {
		priorityClass = 'bg-slate-50 text-slate-600 border-slate-200'
	}
	let priorityDotClass
	if (priority === 1) {
		priorityDotClass = 'bg-red-500'
	} else if (priority === 2) {
		priorityDotClass = 'bg-amber-500'
	} else {
		priorityDotClass = 'bg-slate-500'
	}
	return { priorityClass, priorityDotClass }
}

function IncidentStatusCell({ incident, onUpdateStatus }: Readonly<StatusCellProps>) {
	const { t } = useLanguage()

	const [open, setOpen] = useState(false)

	const currentStatus = incident.status
	const nextStatuses = getNextIncidentStatuses(currentStatus)
	const isDisabled = nextStatuses.length <= 1
	const style = INCIDENT_STATUS_STYLES[currentStatus] || INCIDENT_STATUS_STYLES.new
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
							'inline-flex items-center gap-1.5 py-1.5 pl-3 pr-2.5 rounded-full text-[11px] font-extrabold border whitespace-nowrap',
							'transition-all select-none shadow-sm',
							style.pillBg,
							style.pillText,
							style.pillBorder,
							isDisabled ? 'cursor-default' : 'cursor-pointer hover:brightness-95 active:scale-95',
						)}
					>
						{getStatusLabel(currentStatus, t)}
						{!isDisabled && (
							<ChevronDown
								className={cn('w-3 h-3 opacity-60 transition-transform duration-200', open && 'rotate-180')}
							/>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent
					align="start"
					sideOffset={6}
					className="z-50 bg-white border border-gray-200 rounded-xl p-1.5 shadow-xl min-w-44 w-auto animate-in fade-in zoom-in-95 duration-150"
				>
					{nextStatuses.map((status) => {
						const s = INCIDENT_STATUS_STYLES[status] || INCIDENT_STATUS_STYLES.new
						const SIcon = s.Icon
						return (
							<Button
								key={status}
								type="button"
								variant="ghost"
								onClick={() => {
									onUpdateStatus(incident.id, status)
									setOpen(false)
								}}
								className={cn(
									'flex items-center gap-2 w-full px-2.5 py-2 rounded-lg text-[11px] font-bold text-gray-700',
									'hover:bg-gray-50 cursor-pointer transition-colors text-left',
									status === currentStatus && 'bg-gray-50 font-black text-foreground',
								)}
							>
								<div
									className={cn('w-6 h-6 rounded-md flex items-center justify-center shrink-0', s.iconBg, s.iconColor)}
								>
									<SIcon className="w-3.5 h-3.5" />
								</div>
								<span className="flex-1">{getStatusLabel(status, t)}</span>
								{status === currentStatus && <Check className="w-3.5 h-3.5 text-emerald-500" />}
							</Button>
						)
					})}
				</PopoverContent>
			</Popover>
		</div>
	)
}

export function IncidentTable({
	incidents,
	isLoading,
	onView,
	onEdit,
	onDelete,
	onUpdateStatus,
}: Readonly<IncidentTableProps>) {
	const { t } = useLanguage()

	return (
		<div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
			<div className="min-h-100">
				{isLoading ? (
					<div className="text-center py-20">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
						<p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">
							{t('loadingIncidents')}
						</p>
					</div>
				) : (
					<Table className="w-full border-collapse text-left">
						<TableHeader>
							<TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border">
								<TableHead className="h-auto px-5 py-3.5 text-[11px] font-bold text-muted-foreground uppercase tracking-[0.5px] border-b border-border">
									{t('elevator')}
								</TableHead>
								<TableHead className="h-auto px-5 py-3.5 text-[11px] font-bold text-muted-foreground uppercase tracking-[0.5px] border-b border-border">
									{t('incidentTitle')}
								</TableHead>
								<TableHead className="h-auto px-5 py-3.5 text-[11px] font-bold text-muted-foreground uppercase tracking-[0.5px] border-b border-border">
									{t('description')}
								</TableHead>
								<TableHead className="h-auto px-5 py-3.5 text-[11px] font-bold text-muted-foreground uppercase tracking-[0.5px] border-b border-border">
									{t('priority')}
								</TableHead>
								<TableHead className="h-auto px-5 py-3.5 text-[11px] font-bold text-muted-foreground uppercase tracking-[0.5px] border-b border-border">
									{t('reportedDate')}
								</TableHead>
								<TableHead className="h-auto px-5 py-3.5 text-[11px] font-bold text-muted-foreground uppercase tracking-[0.5px] border-b border-border">
									{t('updatedBy')}
								</TableHead>
								<TableHead className="h-auto px-5 py-3.5 text-[11px] font-bold text-muted-foreground uppercase tracking-[0.5px] border-b border-border">
									{t('status')}
								</TableHead>
								<TableHead className="h-auto px-5 py-3.5 text-[11px] font-bold text-muted-foreground uppercase tracking-[0.5px] border-b border-border text-right">
									{t('actions')}
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{incidents?.length === 0 ? (
								<TableRow>
									<TableCell colSpan={8} className="px-5 py-10 text-center">
										<div className="flex flex-col items-center gap-2 opacity-60">
											<span className="text-[13px] font-medium text-muted-foreground">{t('noIncidentsFound')}</span>
										</div>
									</TableCell>
								</TableRow>
							) : (
								incidents?.map((incident) => {
									return (
										<TableRow
											key={incident.id}
											className="group hover:bg-muted/10 transition-colors border-b border-border/50 last:border-0"
										>
											<TableCell>
												<div className="text-[13px] font-black text-foreground">{incident.elevator.code}</div>
											</TableCell>
											<TableCell>
												<div className="text-[13px] font-semibold text-foreground max-w-52 truncate leading-relaxed">
													{incident.title || t('notAvailable')}
												</div>
											</TableCell>
											<TableCell>
												<div className="text-[13px] font-semibold text-muted-foreground max-w-60 truncate leading-relaxed">
													{incident.description}
												</div>
											</TableCell>
											<TableCell>
												<span
													className={cn(
														'inline-flex items-center gap-1.5 px-3 py-1.25 rounded-5 text-[10px] font-black whitespace-nowrap shadow-sm',
														getPriorityClasses(incident.priority).priorityClass,
													)}
												>
													<div
														className={cn(
															'w-1.5 h-1.5 rounded-full',
															getPriorityClasses(incident.priority).priorityDotClass,
														)}
													/>
													{getPriorityLabel(incident.priority, t)}
												</span>
											</TableCell>
											<TableCell className="text-[12px] font-bold text-muted-foreground/80">
												{formatDisplayDate(incident.createdAt)}
											</TableCell>
											<TableCell className="text-[12px] font-bold text-muted-foreground/80">
												{getUpdatedByLabel(incident, t('notAvailable'))}
											</TableCell>
											<TableCell>
												<IncidentStatusCell incident={incident} onUpdateStatus={onUpdateStatus} />
											</TableCell>
											<TableCell>
												<div className="flex items-center justify-end gap-2">
													<Button
														variant="outline"
														size="icon"
														onClick={() => onView(incident.id)}
														className="w-8 h-8 rounded-2.25 border border-border bg-card text-muted-foreground flex items-center justify-center hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600 transition-all cursor-pointer shadow-sm"
														title={t('view')}
													>
														<Eye className="w-3.5 h-3.5" />
													</Button>
													<Button
														variant="outline"
														size="icon"
														onClick={() => onEdit(incident)}
														className="w-8 h-8 rounded-2.25 border border-border bg-card text-muted-foreground flex items-center justify-center hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all cursor-pointer shadow-sm"
														title={t('edit')}
													>
														<Edit className="w-3.5 h-3.5" />
													</Button>
													<Button
														variant="outline"
														size="icon"
														onClick={() => onDelete(incident.id)}
														className="w-8 h-8 rounded-2.25 border border-border bg-card text-muted-foreground flex items-center justify-center hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all cursor-pointer shadow-sm"
														title={t('delete')}
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
			</div>
		</div>
	)
}
