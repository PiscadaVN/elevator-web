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
import { useLanguage } from '@/i18n/LanguageContext'
import type { ContractFormData, Elevator, User } from '@/types/api'

import { ContractForm } from './ContractForm'

interface AddContractDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	formData: ContractFormData
	setFormData: (data: ContractFormData) => void
	allUsers: User[]
	allElevators: Elevator[]
	onSubmit: () => void
}

export function AddContractDialog({
	open,
	onOpenChange,
	formData,
	setFormData,
	allUsers,
	allElevators,
	onSubmit,
}: AddContractDialogProps) {
	const { t } = useLanguage()

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogTrigger asChild>
				<Button className="shadow-lg hover:shadow-primary/20 transition-all">
					<Plus className="w-4 h-4 mr-2" /> {t('addContract')}
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>{t('addContract')}</DialogTitle>
					<DialogDescription>{t('contractManagementDesc')}</DialogDescription>
				</DialogHeader>
				<ContractForm formData={formData} setFormData={setFormData} allUsers={allUsers} allElevators={allElevators} />
				<DialogFooter>
					<Button onClick={onSubmit}>{t('confirm')}</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
