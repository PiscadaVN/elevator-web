import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { useLanguage } from '@/i18n/LanguageContext'
import type { ContractFormData, Elevator, User } from '@/types/api'

import { ContractForm } from './ContractForm'

interface EditContractDialogProps {
	contract: { id: string } | null
	formData: ContractFormData
	allUsers: User[]
	allElevators: Elevator[]
	setFormData: (data: ContractFormData) => void
	errors: Partial<Record<'customerId' | 'elevatorIds' | 'signedAt' | 'expiredAt', string>>
	setErrors: (errors: Partial<Record<'customerId' | 'elevatorIds' | 'signedAt' | 'expiredAt', string>>) => void
	onSubmit: () => void
	onClose: () => void
}

export function EditContractDialog({
	contract,
	onClose,
	formData,
	setFormData,
	errors,
	setErrors,
	allUsers,
	allElevators,
	onSubmit,
}: Readonly<EditContractDialogProps>) {
	const { t } = useLanguage()

	return (
		<Dialog open={!!contract} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="max-w-135 max-h-[90vh] overflow-y-auto bg-card rounded-4.5 p-7 border-none shadow-[0_20px_60px_rgba(0,0,0,0.15)] gap-0">
				<DialogHeader className="mb-5 text-left flex-row justify-between items-start space-y-0">
					<div>
						<DialogTitle className="text-[17px] font-extrabold text-foreground">
							{t('edit')} {t('contracts').toLowerCase()}
						</DialogTitle>
						<DialogDescription className="text-[12px] text-muted-foreground mt-0.5">
							{t('contractManagementDesc')}
						</DialogDescription>
					</div>
				</DialogHeader>
				<ContractForm
					formData={formData}
					setFormData={setFormData}
					allUsers={allUsers}
					allElevators={allElevators}
					errors={errors}
					setErrors={setErrors}
				/>
				<DialogFooter className="mt-1.5 sm:justify-end gap-2.25 flex-row justify-end space-x-0">
					<Button
						variant="outline"
						onClick={onClose}
						className="py-2.25 px-5 rounded-2.25 border-border bg-background text-[13px] font-bold text-muted-foreground hover:bg-muted/50 transition-colors"
					>
						{t('cancel')}
					</Button>
					<Button
						onClick={onSubmit}
						className="py-2.25 px-5.5 rounded-2.25 border-none bg-primary text-white text-[13px] font-bold transition-colors hover:bg-orange-600"
					>
						{t('save')}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
