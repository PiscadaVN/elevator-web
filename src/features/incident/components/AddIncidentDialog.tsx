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
import { useLanguage } from '@/i18n/LanguageContext'
import type { Elevator, IncidentFormData } from '@/types/api'

interface AddIncidentDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	formData: IncidentFormData
	setFormData: (data: IncidentFormData) => void
	elevators: Elevator[]
	onSubmit: () => void
	isPending?: boolean
}

export function AddIncidentDialog({
	open,
	onOpenChange,
	formData,
	setFormData,
	elevators,
	onSubmit,
	isPending,
}: AddIncidentDialogProps) {
	const { t } = useLanguage()

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogTrigger asChild>
				<Button>
					<Plus className="w-4 h-4 mr-2" /> {t('reportIncident')}
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t('reportIncident')}</DialogTitle>
					<DialogDescription>{t('createIncidentDesc')}</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="space-y-2">
						<Label>{t('elevator')}</Label>
						<Select
							value={formData.elevatorId}
							onValueChange={(v) => setFormData({ ...formData, elevatorId: v } as IncidentFormData)}
						>
							<SelectTrigger>
								<SelectValue placeholder={t('selectElevatorPlaceholder')} />
							</SelectTrigger>
							<SelectContent>
								{elevators.map((el) => (
									<SelectItem key={el.id} value={el.id}>
										{el.code} - {el.address}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-2">
						<Label>{t('description')}</Label>
						<Input
							value={formData.description ?? ''}
							onChange={(e) => setFormData({ ...formData, description: e.target.value })}
							placeholder={t('describeProblemPlaceholder')}
						/>
					</div>
					<div className="space-y-2">
						<Label>{t('priority')}</Label>
						<Input
							type="number"
							value={formData.priority as number}
							onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) })}
							placeholder={t('priorityPlaceholder')}
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
