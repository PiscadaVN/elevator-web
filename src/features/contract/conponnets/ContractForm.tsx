import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MultiSelect } from '@/components/ui/multi-select'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useLanguage } from '@/i18n/LanguageContext'
import { toDateInputValue } from '@/lib/date-utils'
import { UserRoles } from '@/lib/role-utils'
import type { ContractFormData, Elevator, User } from '@/types/api'

interface ContractFormProps {
	formData: ContractFormData
	setFormData: (data: ContractFormData) => void
	allUsers: User[]
	allElevators: Elevator[]
}

export function ContractForm({ formData, setFormData, allUsers, allElevators }: ContractFormProps) {
	const { t } = useLanguage()

	return (
		<div className="grid gap-4 py-4">
			{/* Customer */}
			<div className="space-y-2">
				<Label>{t('customer')}</Label>
				<Select value={formData.customerId} onValueChange={(v) => setFormData({ ...formData, customerId: v })}>
					<SelectTrigger>
						<SelectValue placeholder={t('selectCustomer')} />
					</SelectTrigger>
					<SelectContent>
						{allUsers.map((u) => (
							<SelectItem key={u.id} value={u.id}>
								{u.fullName} ({u.role === UserRoles.ADMIN ? u.email : u.phone})
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Elevators */}
			<div className="space-y-2">
				<Label>{t('linkedElevators')}</Label>
				<div className="flex gap-2">
					<MultiSelect
						value={formData.elevatorIds ?? []}
						onValueChange={(elevatorIds) => setFormData({ ...formData, elevatorIds })}
						options={allElevators.map((e) => ({ label: `${e.code} - ${e.address}`, value: e.id }))}
						placeholder={t('selectElevators')}
						searchPlaceholder={t('searchElevators')}
						emptyText={t('noElevatorsFound')}
					/>
				</div>
			</div>

			{/* Dates */}
			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label>{t('signDate')}</Label>
					<Input
						type="date"
						value={toDateInputValue(formData.signedAt)}
						onChange={(e) =>
							setFormData({
								...formData,
								signedAt: e.target.value ? new Date(e.target.value).getTime() : undefined,
							})
						}
					/>
				</div>
				<div className="space-y-2">
					<Label>{t('expiryDate')}</Label>
					<Input
						type="date"
						value={toDateInputValue(formData.expiredAt)}
						onChange={(e) =>
							setFormData({
								...formData,
								expiredAt: e.target.value ? new Date(e.target.value).getTime() : undefined,
							})
						}
					/>
				</div>
			</div>

			{/* Amount */}
			<div className="space-y-2">
				<Label>{t('amount')}</Label>
				<Input
					type="number"
					value={formData.contractValue || ''}
					onChange={(e) => setFormData({ ...formData, contractValue: Number(e.target.value) })}
					placeholder="0"
				/>
			</div>

			{/* Note */}
			<div className="space-y-2">
				<Label>{t('note')}</Label>
				<Input
					value={formData.note || ''}
					onChange={(e) => setFormData({ ...formData, note: e.target.value })}
					placeholder="..."
				/>
			</div>
		</div>
	)
}
