import { useCallback, useState } from 'react'

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
import { MultiSelect } from '@/components/ui/multi-select'
import { useCreateElevator } from '@/hooks/api'
import { useUsers } from '@/hooks/api/useUser'
import { useLanguage } from '@/i18n/LanguageContext'
import { UserRoles } from '@/lib/role-utils'
import type { ElevatorCreate } from '@/types/api'

interface AddElevatorDialogProps {
	isOpen: boolean
	onClose: () => void
}

export function AddElevatorDialog({ isOpen, onClose }: AddElevatorDialogProps) {
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
		minFloor: 0,
		maxFloor: 0,
		operatorIds: [],
	})

	const resetForm = useCallback(() => {
		setFormData({
			code: '',
			address: '',
			minFloor: 0,
			maxFloor: 0,
			operatorIds: [],
		})
	}, [])

	const handleAddElevator = useCallback(async () => {
		if (!formData.code || !formData.address) {
			alert(t('missingRequiredFields'))
			return
		}

		if (formData.minFloor > formData.maxFloor) {
			alert(t('failedToCreateElevator'))
			return
		}

		try {
			await createMutation.mutateAsync(formData)
			onClose()
			resetForm()
		} catch (_error) {
			alert(t('failedToCreateElevator'))
		}
	}, [formData, createMutation, onClose, resetForm, t])

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t('addElevator')}</DialogTitle>
					<DialogDescription>{t('addElevatorDesc')}</DialogDescription>
				</DialogHeader>

				<div className="grid gap-4 py-4">
					<div className="space-y-2">
						<Label>{t('elevatorCode')}</Label>
						<Input
							value={formData.code}
							onChange={(e) => setFormData({ ...formData, code: e.target.value })}
							placeholder={t('elevatorCodePlaceholder')}
						/>
					</div>

					<div className="space-y-2">
						<Label>{t('building')}</Label>
						<Input
							value={formData.address}
							onChange={(e) => setFormData({ ...formData, address: e.target.value })}
							placeholder={t('buildingPlaceholder')}
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label>{t('minFloor')}</Label>
							<Input
								type="number"
								value={formData.minFloor}
								onChange={(e) => setFormData({ ...formData, minFloor: Number(e.target.value) })}
							/>
						</div>

						<div className="space-y-2">
							<Label>{t('maxFloor')}</Label>
							<Input
								type="number"
								value={formData.maxFloor}
								onChange={(e) => setFormData({ ...formData, maxFloor: Number(e.target.value) })}
							/>
						</div>
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

				<DialogFooter>
					<Button onClick={handleAddElevator} disabled={createMutation.isPending}>
						{createMutation.isPending ? t('creating') : t('confirmAdd')}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
