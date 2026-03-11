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

import { ContractForm } from './ContractForm'
import type { Contract, Elevator, User } from '@/types/api'

interface AddContractDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	formData: Partial<Contract>
	setFormData: (data: Partial<Contract>) => void
	selectedElevatorId: string
	setSelectedElevatorId: (id: string) => void
	allUsers: User[]
	allElevators: Elevator[]
	isAdmin: boolean
	getElevatorName: (id: string) => string
	onSubmit: () => void
}

export function AddContractDialog({
	open,
	onOpenChange,
	formData,
	setFormData,
	selectedElevatorId,
	setSelectedElevatorId,
	allUsers,
	allElevators,
	isAdmin,
	getElevatorName,
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
				<ContractForm
					formData={formData}
					setFormData={setFormData}
					selectedElevatorId={selectedElevatorId}
					setSelectedElevatorId={setSelectedElevatorId}
					allUsers={allUsers}
					allElevators={allElevators}
					isAdmin={isAdmin}
					isEditing={false}
					getElevatorName={getElevatorName}
				/>
				<DialogFooter>
					<Button onClick={onSubmit}>{t('confirm')}</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
