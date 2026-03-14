import { X } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MultiSelect } from '@/components/ui/multi-select'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useUpdateElevator } from '@/hooks/api'
import { useUsers } from '@/hooks/api/useUser'
import { useLanguage } from '@/i18n/LanguageContext'
import { UserRoles } from '@/lib/role-utils'
import type { Elevator, ElevatorStatus, ElevatorUpdate } from '@/types/api'

interface EditElevatorDialogProps {
	isOpen: boolean
	elevator: Elevator
	onClose: () => void
}

export function EditElevatorDialog({ isOpen, elevator, onClose }: Readonly<EditElevatorDialogProps>) {
	const { t } = useLanguage()

	const updateMutation = useUpdateElevator()
	const { data: users = [] } = useUsers()

	const operators = useMemo(() => users.filter((user) => user.role === UserRoles.OPERATOR && user.isActive), [users])
	const operatorOptions = useMemo(
		() =>
			operators.map((operator) => ({
				value: operator.id,
				label: operator.fullName,
			})),
		[operators],
	)

	const [formData, setFormData] = useState<Partial<Elevator>>({
		code: elevator.code,
		address: elevator.address ?? '',
		minFloor: elevator.minFloor ?? 1,
		maxFloor: elevator.maxFloor ?? 2,
		status: elevator.status,
		operatorIds: elevator.operators?.map((operator) => operator.id) ?? [],
	})
	const [errors, setErrors] = useState<Partial<Record<'address' | 'maxFloor', string>>>({})

	const resetForm = useCallback(() => {
		setFormData({
			code: '',
			address: '',
			minFloor: 1,
			maxFloor: 2,
			status: 'active',
			operatorIds: [],
		})
		setErrors({})
	}, [])

	const handleUpdateElevator = async () => {
		const nextErrors: Partial<Record<'address' | 'maxFloor', string>> = {}
		if (!formData.address?.trim()) {
			nextErrors.address = t('missingRequiredFields')
		}
		if ((formData.minFloor ?? 1) > (formData.maxFloor ?? 2)) {
			nextErrors.maxFloor = t('maxFloorMustBeGreaterThanOrEqualMinFloor')
		}

		setErrors(nextErrors)
		if (Object.keys(nextErrors).length > 0) {
			return
		}

		try {
			const updateData: ElevatorUpdate = {
				code: formData.code,
				address: formData.address,
				minFloor: formData.minFloor,
				maxFloor: formData.maxFloor,
				status: formData.status,
				operatorIds: formData.operatorIds,
			}

			await updateMutation.mutateAsync({ elevatorId: elevator.id, data: updateData })
			onClose()
			resetForm()
		} catch {
			// Handled by mutation hook toast.
		}
	}

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(open) => {
				if (!open) {
					resetForm()
					onClose()
				}
			}}
		>
			<DialogContent className="p-7 max-w-130 rounded-4.5 gap-0 border-none shadow-[0_20px_60px_rgba(0,0,0,0.15)] bg-card text-left [&>button]:hidden">
				<div className="flex items-start justify-between mb-5">
					<div>
						<DialogTitle className="text-[17px] font-extrabold text-foreground leading-none">
							{t('edit')}: {elevator.code}
						</DialogTitle>
						<div className="text-[12px] text-muted-foreground mt-0.5 font-medium">{t('elevatorOverviewDesc')}</div>
					</div>
					<Button
						variant="outline"
						size="icon"
						onClick={() => {
							resetForm()
							onClose()
						}}
						className="w-7.5 h-7.5 rounded-1.75 border border-border bg-transparent flex items-center justify-center text-muted-foreground hover:bg-muted transition-all cursor-pointer outline-none"
					>
						<X className="w-3.5 h-3.5" />
					</Button>
				</div>

				<div className="grid grid-cols-2 gap-3 mb-3.5">
					<div>
						<Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.4px] mb-1.25 block">
							{t('elevatorCode')}
						</Label>
						<Input
							value={formData.code ?? ''}
							disabled
							className="h-auto px-3 py-2.5 bg-muted/50 border-border rounded-2.25 text-[13px] text-muted-foreground cursor-not-allowed"
						/>
					</div>
					<div>
						<Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.4px] mb-1.25 block">
							{t('status')}
						</Label>
						<Select
							value={formData.status}
							onValueChange={(v) =>
								setFormData({
									...formData,
									status: v as ElevatorStatus,
								})
							}
						>
							<SelectTrigger className="h-auto px-3 py-2.5 bg-muted/30 border-border rounded-2.25 text-[13px] text-foreground focus:ring-0 focus:border-primary transition-colors">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="active">{t('active')}</SelectItem>
								<SelectItem value="out_of_order">{t('outOfOrder')}</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				<div className="mb-3.5">
					<Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.4px] mb-1.25 block">
						{t('building')} *
					</Label>
					<Input
						value={formData.address ?? ''}
						onChange={(e) => {
							setFormData({ ...formData, address: e.target.value })
							if (errors.address) {
								setErrors({ ...errors, address: undefined })
							}
						}}
						className="h-auto px-3 py-2.5 bg-muted/30 border-border rounded-2.25 text-[13px] text-foreground focus-visible:ring-0 focus-visible:border-primary transition-colors"
					/>
					{errors.address ? <p className="mt-1 text-xs text-destructive">{errors.address}</p> : null}
				</div>

				<div className="grid grid-cols-2 gap-3 mb-3.5">
					<div>
						<Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.4px] mb-1.25 block">
							{t('minFloor')}
						</Label>
						<Input
							type="number"
							min={1}
							value={formData.minFloor ?? 1}
							onChange={(e) => {
								setFormData({ ...formData, minFloor: Number(e.target.value) })
								if (errors.maxFloor) {
									setErrors({ ...errors, maxFloor: undefined })
								}
							}}
							className="h-auto px-3 py-2.5 bg-muted/30 border-border rounded-2.25 text-[13px] text-foreground focus-visible:ring-0 focus-visible:border-primary transition-colors"
						/>
					</div>
					<div>
						<Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.4px] mb-1.25 block">
							{t('maxFloor')}
						</Label>
						<Input
							type="number"
							min={2}
							value={formData.maxFloor ?? 2}
							onChange={(e) => {
								setFormData({ ...formData, maxFloor: Number(e.target.value) })
								if (errors.maxFloor) {
									setErrors({ ...errors, maxFloor: undefined })
								}
							}}
							className="h-auto px-3 py-2.5 bg-muted/30 border-border rounded-2.25 text-[13px] text-foreground focus-visible:ring-0 focus-visible:border-primary transition-colors"
						/>
						{errors.maxFloor ? <p className="mt-1 text-xs text-destructive">{errors.maxFloor}</p> : null}
					</div>
				</div>

				<div className="mb-3.5">
					<Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.4px] mb-1.25 block">
						{t('operators')}
					</Label>
					<MultiSelect
						value={formData.operatorIds ?? []}
						onValueChange={(operatorIds) => setFormData((prev) => ({ ...prev, operatorIds }))}
						options={operatorOptions}
						placeholder={t('selectOperators')}
						searchPlaceholder={t('searchOperators')}
						emptyText={t('noUsersFound')}
					/>
				</div>

				<div className="flex gap-2.25 mt-1.5 justify-end">
					<Button
						variant="outline"
						onClick={() => {
							resetForm()
							onClose()
						}}
						className="px-5 py-2.25 rounded-2.25 border-border bg-muted/30 text-[13px] font-bold text-muted-foreground cursor-pointer hover:bg-muted transition-colors outline-none"
					>
						{t('cancel')}
					</Button>
					<Button
						onClick={handleUpdateElevator}
						disabled={updateMutation.isPending}
						className="px-5.5 py-2.25 rounded-2.25 border-none bg-primary text-white text-[13px] font-bold cursor-pointer hover:bg-orange-600 transition-colors outline-none disabled:opacity-50"
					>
						{updateMutation.isPending ? t('saving') : t('save')}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	)
}
