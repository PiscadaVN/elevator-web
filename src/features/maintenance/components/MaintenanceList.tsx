import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'

import { CommonConfirmDialog } from '@/components/ui/common-confirm-dialog'
import { Input } from '@/components/ui/input'
import { PaginationControls } from '@/components/ui/pagination-controls'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useElevators } from '@/hooks/api/useElevator'
import {
	useCreateMaintenanceSchedule,
	useDeleteMaintenanceSchedule,
	useMaintenanceSchedules,
	useUpdateMaintenanceSchedule,
} from '@/hooks/api/useMaintenance'
import { useLanguage } from '@/i18n/LanguageContext'
import { cn } from '@/lib/utils'
import type { MaintenanceFormData, MaintenanceSchedule, MaintenanceStatus } from '@/types/api'

import { getMaintenanceStatusLabel, MAINTENANCE_STATUS_STYLES, MaintenanceStatusEnum } from '../helpers/status'
import { AddMaintenanceDialog } from './AddMaintenanceDialog'
import { EditMaintenanceDialog } from './EditMaintenanceDialog'
import { MaintenanceTable } from './MaintenanceTable'

const createDefaultFormData = (): MaintenanceFormData => ({
	elevatorId: '',
	status: MaintenanceStatusEnum.SCHEDULED,
	notes: '',
})

const STAT_STATUS_KEYS: MaintenanceStatus[] = [
	MaintenanceStatusEnum.SCHEDULED,
	MaintenanceStatusEnum.UPCOMING,
	MaintenanceStatusEnum.OVERDUE,
	MaintenanceStatusEnum.IN_PROGRESS,
	MaintenanceStatusEnum.COMPLETED,
	MaintenanceStatusEnum.FAILED,
]

const STAT_LABEL_KEYS: Record<string, string> = {
	[MaintenanceStatusEnum.SCHEDULED]: 'maintenanceScheduled',
	[MaintenanceStatusEnum.UPCOMING]: 'maintenanceUpcoming',
	[MaintenanceStatusEnum.OVERDUE]: 'maintenanceOverdue',
	[MaintenanceStatusEnum.IN_PROGRESS]: 'maintenanceInProgress',
	[MaintenanceStatusEnum.COMPLETED]: 'maintenanceCompleted',
	[MaintenanceStatusEnum.FAILED]: 'maintenanceFailed',
}

const LEGEND_STATUSES = Object.values(MaintenanceStatusEnum) as MaintenanceStatus[]
const PAGE_SIZE = 10

export function MaintenanceList() {
	const { t } = useLanguage()

	const { data: schedules = [], isLoading } = useMaintenanceSchedules()
	const { data: elevators = [] } = useElevators()

	const createMutation = useCreateMaintenanceSchedule()
	const updateMutation = useUpdateMaintenanceSchedule()
	const deleteMutation = useDeleteMaintenanceSchedule()

	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
	const [editingSchedule, setEditingSchedule] = useState<MaintenanceSchedule | null>(null)
	const [deletingScheduleId, setDeletingScheduleId] = useState<string | null>(null)
	const [formData, setFormData] = useState<MaintenanceFormData>(createDefaultFormData())
	const [formErrors, setFormErrors] = useState<Partial<Record<'elevatorId' | 'scheduledStartAt', string>>>({})
	const [search, setSearch] = useState('')
	const [statusFilter, setStatusFilter] = useState<MaintenanceStatus | 'all'>('all')
	const [currentPage, setCurrentPage] = useState(1)

	const stats = useMemo(() => {
		const counts: Record<string, number> = {}
		for (const key of STAT_STATUS_KEYS) {
			counts[key] = schedules.filter((s) => s.status === key).length
		}
		return counts
	}, [schedules])

	const filteredSchedules = useMemo(() => {
		const query = search.toLowerCase().trim()
		return schedules.filter((s) => {
			const elevatorCode = (s.elevator?.code ?? elevators.find((e) => e.id === s.elevatorId)?.code ?? '').toLowerCase()
			const operatorName = (s.assignedOperator?.fullName ?? '').toLowerCase()
			const matchesSearch = !query || elevatorCode.includes(query) || operatorName.includes(query)
			const matchesStatus = statusFilter === 'all' || s.status === statusFilter
			return matchesSearch && matchesStatus
		})
	}, [schedules, elevators, search, statusFilter])

	const totalPages = Math.max(1, Math.ceil(filteredSchedules.length / PAGE_SIZE))
	const activePage = Math.min(currentPage, totalPages)

	const paginatedSchedules = useMemo(() => {
		const startIndex = (activePage - 1) * PAGE_SIZE
		return filteredSchedules.slice(startIndex, startIndex + PAGE_SIZE)
	}, [activePage, filteredSchedules])

	const resetForm = () => {
		setFormData(createDefaultFormData())
		setFormErrors({})
	}

	const validateForm = () => {
		const errors: Partial<Record<'elevatorId' | 'scheduledStartAt', string>> = {}

		if (!formData.elevatorId) {
			errors.elevatorId = t('missingRequiredFields')
		}
		if (!formData.scheduledStartAt) {
			errors.scheduledStartAt = t('missingRequiredFields')
		}

		setFormErrors(errors)
		return Object.keys(errors).length === 0
	}

	const handleAddMaintenance = async () => {
		if (!validateForm()) {
			return
		}

		try {
			await createMutation.mutateAsync(formData)
			setIsAddDialogOpen(false)
			resetForm()
		} catch {
			// Handled by mutation hook toast.
		}
	}

	const handleUpdateMaintenance = async () => {
		if (!editingSchedule) return
		if (!validateForm()) {
			return
		}

		try {
			await updateMutation.mutateAsync({ scheduleId: editingSchedule.id, data: formData })
			setEditingSchedule(null)
			resetForm()
		} catch {
			// Handled by mutation hook toast.
		}
	}

	const handleDeleteMaintenance = (scheduleId: string) => {
		setDeletingScheduleId(scheduleId)
	}

	const confirmDeleteMaintenance = async () => {
		if (!deletingScheduleId) return

		try {
			await deleteMutation.mutateAsync(deletingScheduleId)
			setDeletingScheduleId(null)
		} catch {
			// Handled by mutation hook toast.
		}
	}

	const openEditDialog = (schedule: MaintenanceSchedule) => {
		setEditingSchedule(schedule)
		setFormErrors({})
		setFormData({
			elevatorId: schedule.elevatorId,
			scheduledStartAt: schedule.scheduledStartAt,
			status: schedule.status,
			completedAt: schedule.completedAt,
			notes: schedule.notes || '',
		})
	}

	return (
		<div className="p-6 lg:p-8 max-w-350 mx-auto">
			{/* Page Header */}
			<div className="flex justify-between items-start mb-7">
				<div>
					<h1 className="text-[26px] font-extrabold text-gray-900 mb-1">{t('maintenanceManagementTitle')}</h1>
					<p className="text-sm text-gray-400 font-medium">{t('maintenanceManagementDesc')}</p>
				</div>
				<AddMaintenanceDialog
					open={isAddDialogOpen}
					onOpenChange={setIsAddDialogOpen}
					formData={formData}
					setFormData={setFormData}
					errors={formErrors}
					setErrors={setFormErrors}
					elevators={elevators}
					onSubmit={handleAddMaintenance}
					isPending={createMutation.isPending}
				/>
			</div>

			{/* Stats Row */}
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
				{STAT_STATUS_KEYS.map((statusKey) => {
					const style = MAINTENANCE_STATUS_STYLES[statusKey]
					const { Icon } = style
					return (
						<div key={statusKey} className="bg-white border border-gray-200 rounded-xl p-3.5 flex items-center gap-2.5">
							<div
								className={cn(
									'w-9 h-9 rounded-2.25 flex items-center justify-center shrink-0',
									style.iconBg,
									style.iconColor,
								)}
							>
								<Icon className="w-4 h-4" />
							</div>
							<div>
								<div className="text-[18px] font-extrabold text-gray-900 leading-none">{stats[statusKey] ?? 0}</div>
								<div className="text-[11px] font-semibold text-gray-400 mt-0.5">{t(STAT_LABEL_KEYS[statusKey])}</div>
							</div>
						</div>
					)
				})}
			</div>

			{/* Toolbar */}
			<div className="flex items-center gap-2.5 mb-4 flex-wrap">
				<div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 flex-1 min-w-50 max-w-xs">
					<Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
					<Input
						type="text"
						value={search}
						onChange={(e) => {
							setSearch(e.target.value)
							setCurrentPage(1)
						}}
						placeholder={t('searchMaintenancePlaceholder')}
						className="border-none outline-none bg-transparent text-sm text-gray-800 flex-1 placeholder:text-gray-400 font-medium"
					/>
				</div>
				<Select
					value={statusFilter}
					onValueChange={(value) => {
						setStatusFilter(value as MaintenanceStatus | 'all')
						setCurrentPage(1)
					}}
				>
					<SelectTrigger className="w-auto min-w-42 bg-white border border-gray-200 rounded-lg px-3 py-2 h-auto font-semibold text-sm text-gray-700">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">{t('allStatuses')}</SelectItem>
						{Object.values(MaintenanceStatusEnum).map((status) => (
							<SelectItem key={status} value={status}>
								{getMaintenanceStatusLabel(status, t)}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Legend */}
			<div className="flex flex-wrap gap-2.5 mb-5">
				{LEGEND_STATUSES.map((statusKey) => {
					const style = MAINTENANCE_STATUS_STYLES[statusKey]
					const { Icon } = style
					return (
						<div key={statusKey} className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
							<div
								className={cn(
									'w-6.5 h-6.5 rounded-1.75 flex items-center justify-center',
									style.iconBg,
									style.iconColor,
								)}
							>
								<Icon className="w-3.5 h-3.5" />
							</div>
							{getMaintenanceStatusLabel(statusKey, t)}
						</div>
					)
				})}
			</div>

			{/* Table */}
			<MaintenanceTable
				schedules={paginatedSchedules}
				isLoading={isLoading}
				onEdit={openEditDialog}
				onDelete={handleDeleteMaintenance}
			/>

			<PaginationControls
				currentPage={activePage}
				totalItems={filteredSchedules.length}
				pageSize={PAGE_SIZE}
				onPageChange={setCurrentPage}
			/>

			<EditMaintenanceDialog
				schedule={editingSchedule}
				onClose={() => {
					setEditingSchedule(null)
					resetForm()
				}}
				formData={formData}
				setFormData={setFormData}
				errors={formErrors}
				setErrors={setFormErrors}
				elevators={elevators}
				onSubmit={handleUpdateMaintenance}
				isPending={updateMutation.isPending}
			/>

			<CommonConfirmDialog
				open={!!deletingScheduleId}
				onOpenChange={(open) => !open && setDeletingScheduleId(null)}
				title={t('deleteMaintenance')}
				content={t('confirmDeleteMaintenance')}
				cancelText={t('cancel')}
				submitText={t('delete')}
				onSubmit={confirmDeleteMaintenance}
				isPending={deleteMutation.isPending}
			/>
		</div>
	)
}
