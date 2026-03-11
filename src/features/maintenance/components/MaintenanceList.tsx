import { useState } from 'react'

import { useContracts } from '@/hooks/api/useContract'
import { useElevators } from '@/hooks/api/useElevator'
import {
	useCreateMaintenanceSchedule,
	useDeleteMaintenanceSchedule,
	useMaintenanceSchedules,
	useUpdateMaintenanceSchedule,
} from '@/hooks/api/useMaintenance'
import { useUsers } from '@/hooks/api/useUser'
import { useLanguage } from '@/i18n/LanguageContext'
import { UserRoles } from '@/lib/role-utils'
import type {
	MaintenanceFormData,
	MaintenanceSchedule,
	MaintenanceScheduleCreate,
	MaintenanceScheduleUpdate,
} from '@/types/api'

import { toDateTimeLocalValue, toUnixSeconds } from '../helpers/date'
import { MaintenanceStatusEnum } from '../helpers/status'
import { AddMaintenanceDialog } from './AddMaintenanceDialog'
import { EditMaintenanceDialog } from './EditMaintenanceDialog'
import { MaintenanceTable } from './MaintenanceTable'

const createDefaultFormData = (): MaintenanceFormData => ({
	elevatorId: '',
	contractId: '',
	scheduledStartAt: '',
	scheduledEndAt: '',
	assignedOperatorId: '',
	status: MaintenanceStatusEnum.SCHEDULED,
	completedAt: '',
	notes: '',
})

const mapFormToCreatePayload = (formData: MaintenanceFormData): MaintenanceScheduleCreate | null => {
	const scheduledStartAt = toUnixSeconds(formData.scheduledStartAt)
	const scheduledEndAt = toUnixSeconds(formData.scheduledEndAt)
	const completedAt = toUnixSeconds(formData.completedAt)

	if (!formData.elevatorId || !formData.contractId || !scheduledStartAt || !scheduledEndAt) {
		return null
	}

	return {
		elevatorId: formData.elevatorId,
		contractId: formData.contractId,
		scheduledStartAt,
		scheduledEndAt,
		assignedOperatorId: formData.assignedOperatorId || undefined,
		status: formData.status,
		completedAt,
		notes: formData.notes || undefined,
	}
}

const mapFormToUpdatePayload = (formData: MaintenanceFormData): MaintenanceScheduleUpdate => {
	const scheduledStartAt = toUnixSeconds(formData.scheduledStartAt)
	const scheduledEndAt = toUnixSeconds(formData.scheduledEndAt)
	const completedAt = toUnixSeconds(formData.completedAt)

	return {
		elevatorId: formData.elevatorId || undefined,
		contractId: formData.contractId || undefined,
		scheduledStartAt,
		scheduledEndAt,
		assignedOperatorId: formData.assignedOperatorId || undefined,
		status: formData.status,
		completedAt,
		notes: formData.notes || undefined,
	}
}

export function MaintenanceList() {
	const { t } = useLanguage()

	const { data: schedules = [], isLoading } = useMaintenanceSchedules()
	const { data: elevators = [] } = useElevators()
	const { data: contracts = [] } = useContracts()
	const { data: users = [] } = useUsers()

	const createMutation = useCreateMaintenanceSchedule()
	const updateMutation = useUpdateMaintenanceSchedule()
	const deleteMutation = useDeleteMaintenanceSchedule()

	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
	const [editingSchedule, setEditingSchedule] = useState<MaintenanceSchedule | null>(null)
	const [formData, setFormData] = useState<MaintenanceFormData>(createDefaultFormData())

	const operators = users.filter((user) => user.role === UserRoles.OPERATOR)

	const resetForm = () => {
		setFormData(createDefaultFormData())
	}

	const handleAddMaintenance = async () => {
		const payload = mapFormToCreatePayload(formData)
		if (!payload) {
			alert(t('missingRequiredFields'))
			return
		}

		try {
			await createMutation.mutateAsync(payload)
			setIsAddDialogOpen(false)
			resetForm()
		} catch (_error) {
			alert(t('failedToCreateMaintenance'))
		}
	}

	const handleUpdateMaintenance = async () => {
		if (!editingSchedule) return

		try {
			const payload = mapFormToUpdatePayload(formData)
			await updateMutation.mutateAsync({ scheduleId: editingSchedule.id, data: payload })
			setEditingSchedule(null)
			resetForm()
		} catch (_error) {
			alert(t('failedToUpdateMaintenance'))
		}
	}

	const handleDeleteMaintenance = async (scheduleId: string) => {
		if (!confirm(t('confirmDeleteMaintenance'))) return

		try {
			await deleteMutation.mutateAsync(scheduleId)
		} catch (_error) {
			alert(t('failedToDeleteMaintenance'))
		}
	}

	const openEditDialog = (schedule: MaintenanceSchedule) => {
		setEditingSchedule(schedule)
		setFormData({
			elevatorId: schedule.elevatorId,
			contractId: schedule.contractId,
			scheduledStartAt: toDateTimeLocalValue(schedule.scheduledStartAt),
			scheduledEndAt: toDateTimeLocalValue(schedule.scheduledEndAt),
			assignedOperatorId: schedule.assignedOperatorId || '',
			status: schedule.status,
			completedAt: toDateTimeLocalValue(schedule.completedAt),
			notes: schedule.notes || '',
		})
	}

	return (
		<div className="p-8 space-y-8 max-w-7xl mx-auto">
			<header className="flex justify-between items-center border-b pb-6">
				<div>
					<h1 className="text-4xl font-bold tracking-tight">{t('maintenanceManagementTitle')}</h1>
					<p className="text-muted-foreground mt-2">{t('maintenanceManagementDesc')}</p>
				</div>
				<AddMaintenanceDialog
					open={isAddDialogOpen}
					onOpenChange={setIsAddDialogOpen}
					formData={formData}
					setFormData={setFormData}
					elevators={elevators}
					contracts={contracts}
					operators={operators}
					onSubmit={handleAddMaintenance}
					isPending={createMutation.isPending}
				/>
			</header>

			<MaintenanceTable
				schedules={schedules}
				isLoading={isLoading}
				onEdit={openEditDialog}
				onDelete={handleDeleteMaintenance}
			/>

			<EditMaintenanceDialog
				schedule={editingSchedule}
				onClose={() => {
					setEditingSchedule(null)
					resetForm()
				}}
				formData={formData}
				setFormData={setFormData}
				elevators={elevators}
				contracts={contracts}
				operators={operators}
				onSubmit={handleUpdateMaintenance}
				isPending={updateMutation.isPending}
			/>
		</div>
	)
}
