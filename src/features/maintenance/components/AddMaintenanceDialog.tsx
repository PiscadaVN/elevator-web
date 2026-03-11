import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MaintenanceStatusEnum } from '@/features/maintenance/helpers/status'
import { useLanguage } from '@/i18n/LanguageContext'
import type { Contract, Elevator, MaintenanceFormData, User } from '@/types/api'

interface AddMaintenanceDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	formData: MaintenanceFormData
	setFormData: (data: MaintenanceFormData) => void
	elevators: Elevator[]
	contracts: Contract[]
	operators: User[]
	onSubmit: () => void
	isPending?: boolean
}

export function AddMaintenanceDialog({
	open,
	onOpenChange,
	formData,
	setFormData,
	elevators,
	contracts,
	operators,
	onSubmit,
	isPending,
}: AddMaintenanceDialogProps) {
	const { t } = useLanguage()

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogTrigger asChild>
				<Button>
					<Plus className="w-4 h-4 mr-2" /> {t('addMaintenance')}
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t('addMaintenance')}</DialogTitle>
					<DialogDescription>{t('createMaintenanceDesc')}</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="space-y-2">
						<Label>{t('elevator')}</Label>
						<Select
							value={formData.elevatorId}
							onValueChange={(value) => setFormData({ ...formData, elevatorId: value })}
						>
							<SelectTrigger>
								<SelectValue placeholder={t('selectElevatorPlaceholder')} />
							</SelectTrigger>
							<SelectContent>
								{elevators.map((elevator) => (
									<SelectItem key={elevator.id} value={elevator.id}>
										{elevator.code} - {elevator.address ?? t('notAvailable')}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<Label>{t('contract')}</Label>
						<Select
							value={formData.contractId}
							onValueChange={(value) => setFormData({ ...formData, contractId: value })}
						>
							<SelectTrigger>
								<SelectValue placeholder={t('selectContractPlaceholder')} />
							</SelectTrigger>
							<SelectContent>
								{contracts.map((contract) => (
									<SelectItem key={contract.id} value={contract.id}>
										{contract.id}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label>{t('scheduledStartAt')}</Label>
							<Input
								type="datetime-local"
								value={formData.scheduledStartAt}
								onChange={(event) => setFormData({ ...formData, scheduledStartAt: event.target.value })}
							/>
						</div>
						<div className="space-y-2">
							<Label>{t('scheduledEndAt')}</Label>
							<Input
								type="datetime-local"
								value={formData.scheduledEndAt}
								onChange={(event) => setFormData({ ...formData, scheduledEndAt: event.target.value })}
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label>{t('assignedOperator')}</Label>
						<Select
							value={formData.assignedOperatorId || 'none'}
							onValueChange={(value) => setFormData({ ...formData, assignedOperatorId: value === 'none' ? '' : value })}
						>
							<SelectTrigger>
								<SelectValue placeholder={t('selectOperatorPlaceholder')} />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="none">{t('unassigned')}</SelectItem>
								{operators.map((operator) => (
									<SelectItem key={operator.id} value={operator.id}>
										{operator.fullName}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<Label>{t('status')}</Label>
						<Select
							value={formData.status}
							onValueChange={(value) => setFormData({ ...formData, status: value as MaintenanceFormData['status'] })}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value={MaintenanceStatusEnum.SCHEDULED}>{t('scheduled')}</SelectItem>
								<SelectItem value={MaintenanceStatusEnum.IN_PROGRESS}>{t('inProgress')}</SelectItem>
								<SelectItem value={MaintenanceStatusEnum.COMPLETED}>{t('completed')}</SelectItem>
								<SelectItem value={MaintenanceStatusEnum.CANCELLED}>{t('cancelled')}</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<Label>{t('note')}</Label>
						<Input
							value={formData.notes}
							onChange={(event) => setFormData({ ...formData, notes: event.target.value })}
							placeholder={t('maintenanceNotesPlaceholder')}
						/>
					</div>
				</div>
				<DialogFooter>
					<Button onClick={onSubmit} disabled={isPending}>
						{isPending ? t('creating') : t('confirmAdd')}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
