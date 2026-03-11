import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
	getNextIncidentStatuses,
	getStatusLabel,
	IncidentStatusEnum,
} from '@/features/incident/helpers/status-transition'
import { useLanguage } from '@/i18n/LanguageContext'
import type { Incident, IncidentFormData, IncidentStatus } from '@/types/api'

interface EditIncidentDialogProps {
	incident: Incident | null
	onClose: () => void
	formData: IncidentFormData
	setFormData: (data: IncidentFormData) => void
	onSubmit: () => void
	isPending?: boolean
}

export function EditIncidentDialog({
	incident,
	onClose,
	formData,
	setFormData,
	onSubmit,
	isPending,
}: EditIncidentDialogProps) {
	const { t } = useLanguage()

	const baseStatus = incident?.status ?? IncidentStatusEnum.NEW
	const allowedStatuses = [baseStatus, ...getNextIncidentStatuses(baseStatus)].filter(
		(status, index, arr) => arr.indexOf(status) === index,
	)

	return (
		<Dialog open={!!incident} onOpenChange={(open) => !open && onClose()}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{t('edit')} {t('incidents').toLowerCase()}
					</DialogTitle>
					<DialogDescription>{t('updateIncidentDesc')}</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="space-y-2">
						<Label>{t('description')}</Label>
						<Input
							value={formData.description ?? ''}
							onChange={(e) => setFormData({ ...formData, description: e.target.value })}
						/>
					</div>
					<div className="space-y-2">
						<Label>{t('priority')}</Label>
						<Input
							type="number"
							value={formData.priority ?? ''}
							onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) })}
						/>
					</div>
					<div className="space-y-2">
						<Label>{t('status')}</Label>
						<Select
							value={formData.status}
							onValueChange={(v) => setFormData({ ...formData, status: v as IncidentStatus })}
						>
							<SelectTrigger disabled={allowedStatuses.length <= 1}>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{allowedStatuses.map((status) => (
									<SelectItem key={status} value={status}>
										{getStatusLabel(status as IncidentStatus, t)}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>
				<DialogFooter>
					<Button onClick={onSubmit} disabled={isPending}>
						{isPending ? 'Saving...' : t('save')}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
