import { useNavigate } from '@tanstack/react-router'
import { FileText } from 'lucide-react'
import { useMemo, useState } from 'react'

import {
	useContracts,
	useCreateContract,
	useDeleteContract,
	useElevators,
	useUpdateContract,
	useUsers,
} from '@/hooks/api'
import { useLanguage } from '@/i18n/LanguageContext'
import { UserRoles } from '@/lib/role-utils'
import type { Contract, ContractFormData } from '@/types/api'

import { AddContractDialog } from './AddContractDialog'
import { ContractTable } from './ContractTable'
import { EditContractDialog } from './EditContractDialog'

function ContractList() {
	const navigate = useNavigate()
	const { t } = useLanguage()

	const { data: contracts, isLoading: loadingContracts } = useContracts()
	const { data: apiUsers, isLoading: loadingUsers } = useUsers()
	const { data: apiElevators, isLoading: loadingElevators } = useElevators()

	const createContractMutation = useCreateContract()
	const updateContractMutation = useUpdateContract()
	const deleteContractMutation = useDeleteContract()

	const allUsers = useMemo(() => apiUsers?.filter((u) => u.role === UserRoles.USER) || [], [apiUsers])

	const allElevators = useMemo(() => apiElevators || [], [apiElevators])

	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
	const [editingContract, setEditingContract] = useState<Contract | null>(null)

	const [formData, setFormData] = useState<ContractFormData>({
		customerId: '',
		elevatorIds: [],
		signedAt: undefined,
		expiredAt: undefined,
		contractValue: 0,
		status: 'active',
		note: '',
	})

	const navigateToElevator = () => {
		navigate({ to: '/' })
	}

	const handleViewContract = (contractId: string) => {
		navigate({ to: `/contract/${contractId}` })
	}

	const resetForm = () => {
		setFormData({
			customerId: '',
			elevatorIds: [],
			signedAt: undefined,
			expiredAt: undefined,
			contractValue: 0,
			status: 'active',
			note: '',
		})
	}

	const handleAddContract = async () => {
		if (!formData.customerId || !formData.signedAt || !formData.expiredAt || !formData.elevatorIds?.length) return

		try {
			await createContractMutation.mutateAsync(formData)
			setIsAddDialogOpen(false)
			resetForm()
		} catch (_error) {
			alert(t('failedToCreateContract'))
		}
	}

	const handleUpdateContract = async () => {
		if (!editingContract) return

		try {
			await updateContractMutation.mutateAsync({
				contractId: editingContract.id,
				data: formData,
			})
			setEditingContract(null)
			resetForm()
		} catch (_error) {
			alert(t('failedToUpdateContract'))
		}
	}

	const handleDeleteContract = async (id: string) => {
		if (!confirm(t('confirmDelete'))) return

		try {
			await deleteContractMutation.mutateAsync(id)
		} catch (_error) {
			alert(t('failedToDeleteContract'))
		}
	}

	const openEditDialog = (contract: Contract) => {
		setEditingContract(contract)
		setFormData({
			customerId: contract.customer.id,
			elevatorIds: contract.elevators.map((elevator) => elevator.id),
			signedAt: contract.signedAt ?? undefined,
			expiredAt: contract.expiredAt ?? undefined,
			contractValue: contract.contractValue,
			status: contract.status,
			note: contract.note || contract.description || '',
		})
	}

	if (loadingContracts || loadingUsers || loadingElevators) {
		return (
			<div className="p-8 flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
					<p className="text-muted-foreground">{t('loadingContracts')}</p>
				</div>
			</div>
		)
	}

	return (
		<div className="p-8 space-y-8 max-w-7xl mx-auto">
			<header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
				<div>
					<h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
						<FileText className="w-10 h-10 text-primary" />
						{t('contractManagementTitle')}
					</h1>
					<p className="text-muted-foreground mt-2">{t('contractManagementDesc')}</p>
				</div>

				<AddContractDialog
					open={isAddDialogOpen}
					onOpenChange={setIsAddDialogOpen}
					formData={formData}
					setFormData={setFormData}
					allUsers={allUsers}
					allElevators={allElevators}
					onSubmit={handleAddContract}
				/>
			</header>

			<ContractTable
				contracts={contracts || []}
				onView={handleViewContract}
				onEdit={openEditDialog}
				onDelete={handleDeleteContract}
				onElevatorClick={navigateToElevator}
				isDeleting={deleteContractMutation.isPending}
			/>

			{editingContract && (
				<EditContractDialog
					contract={{ id: editingContract.id }}
					onClose={() => {
						setEditingContract(null)
						resetForm()
					}}
					formData={formData}
					setFormData={setFormData}
					allUsers={allUsers}
					allElevators={allElevators}
					onSubmit={handleUpdateContract}
				/>
			)}
		</div>
	)
}

export default ContractList
