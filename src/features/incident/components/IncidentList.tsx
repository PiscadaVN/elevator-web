import { useState } from 'react'

import { canTransitionIncidentStatus, IncidentStatusEnum } from '@/features/incident/helpers/status-transition'
import { useElevators } from '@/hooks/api/useElevator'
import { useCreateIncident, useDeleteIncident, useIncidents, useUpdateIncident } from '@/hooks/api/useIncident'
import { useLanguage } from '@/i18n/LanguageContext'
import type { Incident, IncidentCreate, IncidentStatus, IncidentUpdate } from '@/types/api'

import { AddIncidentDialog } from './AddIncidentDialog'
import { EditIncidentDialog } from './EditIncidentDialog'
import { IncidentTable } from './IncidentTable'

export function IncidentList() {
	const { t } = useLanguage()

	const { data: incidents = [], isLoading } = useIncidents()
	const { data: elevators = [] } = useElevators()
	const createMutation = useCreateIncident()
	const updateMutation = useUpdateIncident()
	const deleteMutation = useDeleteIncident()

	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
	const [editingIncident, setEditingIncident] = useState<Incident | null>(null)

	const [formData, setFormData] = useState<Partial<Incident>>({
		elevatorId: '',
		description: '',
		priority: 1,
		status: IncidentStatusEnum.NEW,
	})

	const handleAddIncident = async () => {
		if (!formData.elevatorId || !formData.description) return

		try {
			const newIncidentData: IncidentCreate = {
				title: formData.description.substring(0, 50),
				elevatorId: formData.elevatorId,
				description: formData.description,
				priority: formData.priority,
				status: IncidentStatusEnum.NEW,
			}

			await createMutation.mutateAsync(newIncidentData)
			setIsAddDialogOpen(false)
			resetForm()
		} catch (_error) {
			alert(t('failedToCreateIncident'))
		}
	}

	const handleUpdateIncident = async () => {
		if (!editingIncident) return

		try {
			if (formData.status && !canTransitionIncidentStatus(editingIncident.status, formData.status)) {
				alert(t('invalidIncidentStatusTransition'))
				return
			}

			const updateData: IncidentUpdate = {
				title: formData.description?.substring(0, 50),
				description: formData.description,
				priority: formData.priority,
				status: formData.status as IncidentStatus,
			}

			await updateMutation.mutateAsync({ incidentId: editingIncident.id, data: updateData })
			setEditingIncident(null)
			resetForm()
		} catch (_error) {
			alert(t('failedToUpdateIncident'))
		}
	}

	const handleDeleteIncident = async (id: string) => {
		if (!confirm(t('confirmDeleteIncident'))) return

		try {
			await deleteMutation.mutateAsync(id)
		} catch (_error) {
			alert(t('failedToDeleteIncident'))
		}
	}

	const handleUpdateStatus = async (id: string, status: IncidentStatus) => {
		try {
			const incident = incidents.find((item) => item.id === id)
			if (!incident) {
				return
			}

			if (!canTransitionIncidentStatus(incident.status, status)) {
				alert(t('invalidIncidentStatusTransition'))
				return
			}

			await updateMutation.mutateAsync({
				incidentId: id,
				data: { status },
			})
		} catch (_error) {
			alert(t('failedToUpdateStatus'))
		}
	}

	const resetForm = () => {
		setFormData({
			elevatorId: '',
			description: '',
			priority: 1,
			status: IncidentStatusEnum.NEW,
		})
	}

	const openEditDialog = (incident: Incident) => {
		setEditingIncident(incident)
		setFormData({
			elevatorId: incident.elevatorId,
			description: incident.description,
			priority: incident.priority,
			status: incident.status,
		})
	}

	return (
		<div className="p-8 space-y-8 max-w-7xl mx-auto">
			<header className="flex justify-between items-center border-b pb-6">
				<div>
					<h1 className="text-4xl font-bold tracking-tight">{t('incidents')}</h1>
					<p className="text-muted-foreground mt-2">{t('requiresAttention')}</p>
				</div>
				<AddIncidentDialog
					open={isAddDialogOpen}
					onOpenChange={setIsAddDialogOpen}
					formData={formData}
					setFormData={setFormData}
					elevators={elevators}
					onSubmit={handleAddIncident}
					isPending={createMutation.isPending}
				/>
			</header>

			<IncidentTable
				incidents={incidents}
				isLoading={isLoading}
				onEdit={openEditDialog}
				onDelete={handleDeleteIncident}
				onUpdateStatus={handleUpdateStatus}
			/>

			<EditIncidentDialog
				incident={editingIncident}
				onClose={() => {
					setEditingIncident(null)
					resetForm()
				}}
				formData={formData}
				setFormData={setFormData}
				onSubmit={handleUpdateIncident}
				isPending={updateMutation.isPending}
			/>
		</div>
	)
}
