import { DatePicker } from '@/components/ui/date-picker'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MoneyInput } from '@/components/ui/money-input'
import { MultiSelect } from '@/components/ui/multi-select'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useLanguage } from '@/i18n/LanguageContext'
import { UserRoles } from '@/lib/role-utils'
import type { ContractFormData, Elevator, User } from '@/types/api'

interface ContractFormProps {
	formData: ContractFormData
	setFormData: (data: ContractFormData) => void
	allUsers: User[]
	allElevators: Elevator[]
	errors?: ContractFormErrors
	setErrors?: (errors: ContractFormErrors) => void
}

type ContractFormErrors = Partial<Record<'customerId' | 'elevatorIds' | 'signedAt' | 'expiredAt', string>>

const labelClass = 'text-[11px] font-bold text-muted-foreground mb-1.25 block uppercase tracking-[0.4px]'
const inputClass =
	'w-full bg-background border-border rounded-2.25 px-3 py-2.5 h-auto text-[13px] font-inherit text-foreground outline-none transition-colors focus-visible:border-primary focus-visible:ring-0'

export function ContractForm({
	formData,
	setFormData,
	allUsers,
	allElevators,
	errors,
	setErrors,
}: Readonly<ContractFormProps>) {
	const { t } = useLanguage()

	const clearError = (field: 'customerId' | 'elevatorIds' | 'signedAt' | 'expiredAt') => {
		if (!errors?.[field] || !setErrors) return

		setErrors({ ...errors, [field]: undefined })
	}

	const signedAtDate = typeof formData.signedAt === 'number' ? new Date(formData.signedAt * 1000) : undefined
	const expiredAtDate = typeof formData.expiredAt === 'number' ? new Date(formData.expiredAt * 1000) : undefined

	const hasInvalidDateRange =
		typeof formData.signedAt === 'number' &&
		typeof formData.expiredAt === 'number' &&
		formData.expiredAt < formData.signedAt

	return (
		<div className="py-2">
			<div className="mb-3.5">
				<Label className={labelClass}>{t('customer')}</Label>
				<Select
					value={formData.customerId}
					onValueChange={(v) => {
						setFormData({ ...formData, customerId: v })
						clearError('customerId')
					}}
				>
					<SelectTrigger className={inputClass}>
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
				{errors?.customerId ? (
					<p className="mt-1 text-[11px] font-medium text-destructive">{errors.customerId}</p>
				) : null}
			</div>

			<div className="mb-3.5">
				<Label className={labelClass}>{t('linkedElevators')}</Label>
				<div className="flex gap-2">
					<MultiSelect
						value={formData.elevatorIds ?? []}
						onValueChange={(elevatorIds) => {
							setFormData({ ...formData, elevatorIds })
							clearError('elevatorIds')
						}}
						options={allElevators.map((e) => ({ label: `${e.code} - ${e.address}`, value: e.id }))}
						placeholder={t('selectElevators')}
						searchPlaceholder={t('searchElevators')}
						emptyText={t('noElevatorsFound')}
						className={inputClass}
					/>
				</div>
				{errors?.elevatorIds ? (
					<p className="mt-1 text-[11px] font-medium text-destructive">{errors.elevatorIds}</p>
				) : null}
			</div>

			<div className="grid grid-cols-2 gap-3 mb-3.5">
				<div>
					<Label className={labelClass}>{t('signDate')}</Label>
					<DatePicker
						date={signedAtDate}
						buttonClassName={inputClass}
						onDateChange={(date) => {
							const signedAt = date ? date.getTime() / 1000 : undefined
							const nextExpiredAt =
								typeof signedAt === 'number' && typeof formData.expiredAt === 'number' && formData.expiredAt < signedAt
									? undefined
									: formData.expiredAt

							setFormData({
								...formData,
								signedAt,
								expiredAt: nextExpiredAt,
							})
							clearError('signedAt')
							if (nextExpiredAt !== undefined) {
								clearError('expiredAt')
							}
						}}
					/>
					{errors?.signedAt ? <p className="mt-1 text-[11px] font-medium text-destructive">{errors.signedAt}</p> : null}
				</div>
				<div>
					<Label className={labelClass}>{t('expiryDate')}</Label>
					<DatePicker
						date={expiredAtDate}
						buttonClassName={inputClass}
						disabled={signedAtDate ? { before: signedAtDate } : undefined}
						onDateChange={(date) => {
							setFormData({
								...formData,
								expiredAt: date ? date.getTime() / 1000 : undefined,
							})
							clearError('expiredAt')
						}}
					/>
					{errors?.expiredAt ? (
						<p className="mt-1 text-[11px] font-medium text-destructive">{errors.expiredAt}</p>
					) : null}
					{hasInvalidDateRange && !errors?.expiredAt ? (
						<p className="mt-1 text-[11px] font-medium text-destructive">{t('expiryDateMustBeOnOrAfterSignDate')}</p>
					) : null}
				</div>
			</div>

			<div className="mb-3.5">
				<Label className={labelClass}>{t('contractAmount')}</Label>
				<MoneyInput
					value={Number(formData.contractValue)}
					onValueChange={(value) => setFormData({ ...formData, contractValue: value })}
				/>
			</div>

			<div className="grid grid-cols-2 gap-3 mb-3.5">
				<div>
					<Label className={labelClass}>{t('priority')}</Label>
					<Input
						type="number"
						min={0}
						className={inputClass}
						value={formData.priority || ''}
						onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) })}
						placeholder="0"
					/>
				</div>

				<div>
					<Label className={labelClass}>{t('status')}</Label>
					<Select
						value={formData.status}
						onValueChange={(v: 'active' | 'expired') => setFormData({ ...formData, status: v })}
					>
						<SelectTrigger className={inputClass}>
							<SelectValue placeholder={t('status')} />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="active">{t('contractActive')}</SelectItem>
							<SelectItem value="expired">{t('contractExpired')}</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="mb-3.5">
				<Label className={labelClass}>{t('note')}</Label>
				<Input
					className={inputClass}
					value={formData.note || ''}
					onChange={(e) => setFormData({ ...formData, note: e.target.value })}
					placeholder="..."
				/>
			</div>
		</div>
	)
}
