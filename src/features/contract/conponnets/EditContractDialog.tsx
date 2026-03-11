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
	onClose: () => void
	formData: ContractFormData
	setFormData: (data: ContractFormData) => void
	allUsers: User[]
	allElevators: Elevator[]
	onSubmit: () => void
}

export function EditContractDialog({
	contract,
	onClose,
	formData,
	setFormData,
	allUsers,
	allElevators,
	onSubmit,
}: EditContractDialogProps) {
	const { t } = useLanguage()

	return (
		<Dialog open={!!contract} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>
						{t('edit')} {t('contracts').toLowerCase()}
					</DialogTitle>
					<DialogDescription>{t('contractManagementDesc')}</DialogDescription>
				</DialogHeader>
				<ContractForm formData={formData} setFormData={setFormData} allUsers={allUsers} allElevators={allElevators} />
				<DialogFooter>
					<Button onClick={onSubmit}>{t('save')}</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
