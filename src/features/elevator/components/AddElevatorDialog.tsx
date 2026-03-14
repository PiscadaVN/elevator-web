import { X } from 'lucide-react'
import { useCallback, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MultiSelect } from '@/components/ui/multi-select'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCreateElevator } from '@/hooks/api'
import { useUsers } from '@/hooks/api/useUser'
import { useLanguage } from '@/i18n/LanguageContext'
import { UserRoles } from '@/lib/role-utils'
import type { ElevatorCreate, ElevatorStatus } from '@/types/api'

interface AddElevatorDialogProps {
	isOpen: boolean
	onClose: () => void
}

export function AddElevatorDialog({ isOpen, onClose }: Readonly<AddElevatorDialogProps>) {
	const { t } = useLanguage()

	const createMutation = useCreateElevator()
	const { data: users = [] } = useUsers()

	const operators = users.filter((user) => user.role === UserRoles.OPERATOR && user.isActive)
	const operatorOptions = operators.map((operator) => ({
		value: operator.id,
		label: operator.fullName,
	}))

	const [formData, setFormData] = useState<ElevatorCreate>({
		code: '',
		address: '',
		minFloor: 1,
		maxFloor: 2,
		operatorIds: [],
		status: 'active',
	})
	const [errors, setErrors] = useState<Partial<Record<'code' | 'address' | 'minFloor' | 'maxFloor', string>>>({})

	const resetForm = useCallback(() => {
		setFormData({
			code: '',
			address: '',
			minFloor: 1,
			maxFloor: 2,
			operatorIds: [],
			status: 'active',
		})
		setErrors({})
	}, [])

	const handleAddElevator = useCallback(async () => {
		const nextErrors: Partial<Record<'code' | 'address' | 'minFloor' | 'maxFloor', string>> = {}
		if (!formData.code.trim()) {
			nextErrors.code = t('missingRequiredFields')
		}
		if (!formData.address.trim()) {
			nextErrors.address = t('missingRequiredFields')
		}
		if (formData.minFloor > formData.maxFloor) {
			nextErrors.maxFloor = t('maxFloorMustBeGreaterThanOrEqualMinFloor')
		}

		setErrors(nextErrors)

		if (Object.keys(nextErrors).length > 0) {
			return
		}

		try {
			await createMutation.mutateAsync(formData)
			onClose()
			resetForm()
		} catch {
			// Handled by mutation hook toast.
		}
	}, [formData, createMutation, onClose, resetForm, t])

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
							{t('addElevator')}
						</DialogTitle>
						<div className="text-[12px] text-muted-foreground mt-0.5 font-medium">{t('addElevatorDesc')}</div>
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
							{t('elevatorCode')} *
						</Label>
						<Input
							value={formData.code}
							onChange={(e) => {
								setFormData({ ...formData, code: e.target.value })
								if (errors.code) {
									setErrors({ ...errors, code: undefined })
								}
							}}
							placeholder={t('elevatorCodePlaceholder')}
							className="h-auto px-3 py-2.5 bg-muted/30 border-border rounded-2.25 text-[13px] text-foreground focus-visible:ring-0 focus-visible:border-primary transition-colors"
						/>
						{errors.code ? <p className="mt-1 text-xs text-destructive">{errors.code}</p> : null}
					</div>
					<div>
						<Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.4px] mb-1.25 block">
							{t('status')} *
						</Label>
						<Select
							value={formData.status || 'active'}
							onValueChange={(val) => setFormData({ ...formData, status: val as ElevatorStatus })}
						>
							<SelectTrigger className="h-auto px-3 py-2.5 bg-muted/30 border-border rounded-2.25 text-[13px] text-foreground focus:ring-0 focus:border-primary transition-colors">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="active">{t('elevatorStatus_available')}</SelectItem>
								<SelectItem value="out_of_order">{t('elevatorStatus_out_of_order')}</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				<div className="mb-3.5">
					<Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.4px] mb-1.25 block">
						{t('building')} *
					</Label>
					<Input
						value={formData.address}
						onChange={(e) => {
							setFormData({ ...formData, address: e.target.value })
							if (errors.address) {
								setErrors({ ...errors, address: undefined })
							}
						}}
						placeholder={t('buildingPlaceholder')}
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
							value={formData.minFloor}
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
							value={formData.maxFloor}
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
						onClick={handleAddElevator}
						disabled={createMutation.isPending}
						className="px-5.5 py-2.25 rounded-2.25 border-none bg-primary text-white text-[13px] font-bold cursor-pointer hover:bg-orange-600 transition-colors outline-none disabled:opacity-50"
					>
						{createMutation.isPending ? t('creating') : t('confirmAdd')}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	)
}
