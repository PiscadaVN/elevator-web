import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
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
	getMaintenanceStatusLabel,
	getNextMaintenanceStatuses,
	MaintenanceStatusEnum,
} from '@/features/maintenance/helpers/status'
import { useLanguage } from '@/i18n/LanguageContext'
import type { Elevator, MaintenanceFormData, MaintenanceSchedule, MaintenanceStatus } from '@/types/api'

interface EditMaintenanceDialogProps {
	schedule: MaintenanceSchedule | null
	onClose: () => void
	formData: MaintenanceFormData
	setFormData: (data: MaintenanceFormData) => void
	errors: Partial<Record<'elevatorId' | 'scheduledStartAt', string>>
	setErrors: (errors: Partial<Record<'elevatorId' | 'scheduledStartAt', string>>) => void
	elevators: Elevator[]
	onSubmit: () => void
	isPending?: boolean
}

export function EditMaintenanceDialog({
	schedule,
	onClose,
	formData,
	setFormData,
	errors,
	setErrors,
	elevators,
	onSubmit,
	isPending,
}: Readonly<EditMaintenanceDialogProps>) {
	const { t } = useLanguage()

	const nextStatuses = getNextMaintenanceStatuses(schedule?.status ?? MaintenanceStatusEnum.SCHEDULED)
	const scheduledStartDate =
		typeof formData.scheduledStartAt === 'number' ? new Date(formData.scheduledStartAt * 1000) : undefined

	return (
		<Dialog
			open={!!schedule}
			onOpenChange={(open) => {
				if (!open) {
					setErrors({})
					onClose()
				}
			}}
		>
			<DialogContent className="sm:max-w-115 p-6 rounded-2xl bg-white border-0 shadow-[0_20px_60px_rgba(0,0,0,0.15)] gap-0">
				<DialogHeader className="mb-4.5 space-y-0">
					<DialogTitle className="text-[16px] font-extrabold text-gray-900 leading-tight block">
						{t('edit')} {t('maintenance').toLowerCase()}
					</DialogTitle>
					<DialogDescription hidden>{t('updateMaintenanceDesc')}</DialogDescription>
				</DialogHeader>

				<div className="space-y-3.25">
					<div className="space-y-1">
						<Label className="text-[11px] font-bold text-gray-600 uppercase tracking-[0.4px] block">
							{t('elevator')} *
						</Label>
						<Select
							value={formData.elevatorId}
							onValueChange={(value) => {
								setFormData({ ...formData, elevatorId: value })
								if (errors.elevatorId) {
									setErrors({ ...errors, elevatorId: undefined })
								}
							}}
							disabled
						>
							<SelectTrigger className="w-full bg-[#f8f9fb] border-gray-200 rounded-lg px-2.75 py-2.25 text-[13px] text-gray-900 focus:ring-0 focus:border-[#f97316] h-auto shadow-none">
								<SelectValue placeholder={t('selectElevatorPlaceholder')} />
							</SelectTrigger>
							<SelectContent>
								{elevators.map((elevator) => (
									<SelectItem key={elevator.id} value={elevator.id} className="text-[13px]">
										{elevator.code} - {elevator.address ?? t('notAvailable')}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{errors.elevatorId ? <p className="text-xs text-destructive">{errors.elevatorId}</p> : null}
					</div>

					<div className="grid grid-cols-2 gap-3">
						<div className="space-y-1">
							<Label className="text-[11px] font-bold text-gray-600 uppercase tracking-[0.4px] block">
								{t('status')}
							</Label>
							<Select
								value={formData.status}
								onValueChange={(value) => setFormData({ ...formData, status: value as MaintenanceStatus })}
								disabled={nextStatuses.length === 1}
							>
								<SelectTrigger className="w-full bg-[#f8f9fb] border-gray-200 rounded-lg px-2.75 py-2.25 text-[13px] text-gray-900 focus:ring-0 focus:border-[#f97316] h-auto shadow-none disabled:opacity-50">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{nextStatuses.map((status) => (
										<SelectItem key={status} value={status} className="text-[13px]">
											{getMaintenanceStatusLabel(status, t)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-1">
							<Label className="text-[11px] font-bold text-gray-600 uppercase tracking-[0.4px] block">
								{t('scheduledAt')} *
							</Label>
							<DatePicker
								date={scheduledStartDate}
								buttonClassName="w-full bg-[#f8f9fb] border-gray-200 rounded-lg px-2.75 py-2.25 text-[13px] text-gray-900 focus-visible:ring-0 focus-visible:border-[#f97316] h-auto shadow-none"
								onDateChange={(date) => {
									setFormData({
										...formData,
										scheduledStartAt: date ? date.getTime() / 1000 : undefined,
									})
									if (errors.scheduledStartAt) {
										setErrors({ ...errors, scheduledStartAt: undefined })
									}
								}}
							/>
							{errors.scheduledStartAt ? <p className="text-xs text-destructive">{errors.scheduledStartAt}</p> : null}
						</div>
					</div>

					<div className="space-y-1">
						<Label className="text-[11px] font-bold text-gray-600 uppercase tracking-[0.4px] block">{t('note')}</Label>
						<Input
							className="w-full bg-[#f8f9fb] border-gray-200 rounded-lg px-2.75 py-2.25 text-[13px] text-gray-900 focus-visible:ring-0 focus-visible:border-[#f97316] h-auto shadow-none"
							value={formData.notes || ''}
							onChange={(event) => setFormData({ ...formData, notes: event.target.value })}
							placeholder={t('maintenanceNotesPlaceholder')}
						/>
					</div>
				</div>
				<DialogFooter className="flex flex-row justify-between gap-2.25 mt-4.75 sm:space-x-0">
					<Button
						variant="outline"
						onClick={onClose}
						className="flex-1 p-2.5 rounded-2.25 border-gray-200 bg-[#f8f9fb] text-[13px] font-bold text-gray-700 shadow-none hover:bg-gray-100 h-auto"
					>
						{t('cancel')}
					</Button>
					<Button
						onClick={onSubmit}
						disabled={isPending}
						className="flex-1 p-2.5 rounded-2.25 border-none bg-gray-900 text-white text-[13px] font-bold hover:bg-gray-700 shadow-none h-auto"
					>
						{isPending ? t('saving') : t('save')}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
