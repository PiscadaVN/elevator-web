import { useCallback, useEffect, useMemo, useState } from 'react'

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
import { MultiSelect } from '@/components/ui/multi-select'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useUpdateElevator } from '@/hooks/api'
import { useUsers } from '@/hooks/api/useUser'
import { useLanguage } from '@/i18n/LanguageContext'
import { UserRoles } from '@/lib/role-utils'
import type { Elevator, ElevatorStatus, ElevatorUpdate } from '@/types/api'

interface EditElevatorDialogProps {
	isOpen: boolean
	onClose: () => void
	elevator: Elevator
}

export function EditElevatorDialog({ isOpen, onClose, elevator }: EditElevatorDialogProps) {
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
		code: '',
		address: '',
		minFloor: 0,
		maxFloor: 0,
		status: 'active',
		operatorIds: [],
	})

	useEffect(() => {
		setFormData({
			code: elevator.code,
			address: elevator.address ?? '',
			minFloor: elevator.minFloor ?? 0,
			maxFloor: elevator.maxFloor ?? 0,
			status: elevator.status,
			operatorIds: elevator.operatorIds ?? [],
		})
	}, [elevator])

	const resetForm = useCallback(() => {
		setFormData({
			code: '',
			address: '',
			minFloor: 0,
			maxFloor: 0,
			status: 'active',
			operatorIds: [],
		})
	}, [])

	const handleUpdateElevator = async () => {
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
		} catch (_error) {
			alert(t('failedToUpdateElevator'))
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogTrigger asChild></DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{t('edit')}: {elevator.code}
					</DialogTitle>
					<DialogDescription>{t('elevatorOverviewDesc')}</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="space-y-2">
						<Label>{t('elevatorCode')}</Label>
						<Input value={formData.code ?? ''} onChange={(e) => setFormData({ ...formData, code: e.target.value })} />
					</div>

					<div className="space-y-2">
						<Label>{t('building')}</Label>
						<Input
							value={formData.address ?? ''}
							onChange={(e) => setFormData({ ...formData, address: e.target.value })}
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label>{t('minFloor')}</Label>
							<Input
								type="number"
								value={formData.minFloor ?? 0}
								onChange={(e) => setFormData({ ...formData, minFloor: Number(e.target.value) })}
							/>
						</div>
						<div className="space-y-2">
							<Label>{t('maxFloor')}</Label>
							<Input
								type="number"
								value={formData.maxFloor ?? 0}
								onChange={(e) => setFormData({ ...formData, maxFloor: Number(e.target.value) })}
							/>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label>{t('status')}</Label>
							<Select
								value={formData.status}
								onValueChange={(v) =>
									setFormData({
										...formData,
										status: v as ElevatorStatus,
									})
								}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="active">{t('normal')}</SelectItem>
									<SelectItem value="out_of_order">{t('outOfOrder')}</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label>{t('operators')}</Label>
							<MultiSelect
								value={formData.operatorIds ?? []}
								onValueChange={(operatorIds) => setFormData((prev) => ({ ...prev, operatorIds }))}
								options={operatorOptions}
								placeholder={t('selectOperators')}
								searchPlaceholder={t('searchOperators')}
								emptyText={t('noUsersFound')}
							/>
						</div>
					</div>
				</div>
				<DialogFooter>
					<Button onClick={handleUpdateElevator} disabled={updateMutation.isPending}>
						{updateMutation.isPending ? t('saving') : t('save')}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
