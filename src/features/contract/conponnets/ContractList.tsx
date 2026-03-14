import { useNavigate } from '@tanstack/react-router'
import { CheckCircle, FileText, FileX, Search } from 'lucide-react'
import { useMemo, useState } from 'react'

import { CommonConfirmDialog } from '@/components/ui/common-confirm-dialog'
import { Input } from '@/components/ui/input'
import { PaginationControls } from '@/components/ui/pagination-controls'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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

const PAGE_SIZE = 10

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
	const [deletingContractId, setDeletingContractId] = useState<string | null>(null)
	const [searchValue, setSearchValue] = useState('')
	const [statusFilter, setStatusFilter] = useState('all')
	const [currentPage, setCurrentPage] = useState(1)
	const [formErrors, setFormErrors] = useState<
		Partial<Record<'customerId' | 'elevatorIds' | 'signedAt' | 'expiredAt', string>>
	>({})

	const [formData, setFormData] = useState<ContractFormData>({
		customerId: '',
		elevatorIds: [],
		signedAt: undefined,
		expiredAt: undefined,
		contractValue: 0,
		status: 'active',
		note: '',
	})

	const navigateToElevator = (elevatorId: string) => {
		navigate({ to: `/elevator/${elevatorId}` })
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
			priority: 5,
			note: '',
		})
		setFormErrors({})
	}

	const validateContractForm = () => {
		const errors: Partial<Record<'customerId' | 'elevatorIds' | 'signedAt' | 'expiredAt', string>> = {}

		if (!formData.customerId) {
			errors.customerId = t('missingRequiredFields')
		}
		if (!formData.elevatorIds?.length) {
			errors.elevatorIds = t('missingRequiredFields')
		}
		if (!formData.signedAt) {
			errors.signedAt = t('missingRequiredFields')
		}
		if (!formData.expiredAt) {
			errors.expiredAt = t('missingRequiredFields')
		}
		if (
			typeof formData.signedAt === 'number' &&
			typeof formData.expiredAt === 'number' &&
			formData.expiredAt < formData.signedAt
		) {
			errors.expiredAt = t('expiryDateMustBeOnOrAfterSignDate')
		}

		setFormErrors(errors)
		return Object.keys(errors).length === 0
	}

	const handleAddContract = async () => {
		if (!validateContractForm()) {
			return
		}

		try {
			await createContractMutation.mutateAsync(formData)
			setIsAddDialogOpen(false)
			resetForm()
		} catch {
			// Handled by mutation hook toast.
		}
	}

	const handleUpdateContract = async () => {
		if (!editingContract) return
		if (!validateContractForm()) {
			return
		}

		try {
			await updateContractMutation.mutateAsync({
				contractId: editingContract.id,
				data: formData,
			})
			setEditingContract(null)
			resetForm()
		} catch {
			// Handled by mutation hook toast.
		}
	}

	const handleDeleteContract = (id: string) => {
		setDeletingContractId(id)
	}

	const handleConfirmDeleteContract = async () => {
		if (!deletingContractId) return

		try {
			await deleteContractMutation.mutateAsync(deletingContractId)
			setDeletingContractId(null)
		} catch {
			// Handled by mutation hook toast.
		}
	}

	const openEditDialog = (contract: Contract) => {
		setEditingContract(contract)
		setFormErrors({})
		setFormData({
			customerId: contract.customer.id,
			elevatorIds: contract.elevators.map((elevator) => elevator.id),
			signedAt: contract.signedAt ?? undefined,
			expiredAt: contract.expiredAt ?? undefined,
			contractValue: contract.contractValue ?? 0,
			status: contract.status,
			priority: contract.priority,
			note: contract.note || contract.description || '',
		})
	}

	const filteredContracts = useMemo(
		() =>
			(contracts || []).filter((contract) => {
				const normalizedSearch = searchValue.trim().toLowerCase()
				const matchesSearch =
					normalizedSearch.length === 0 ||
					contract.customer.fullName.toLowerCase().includes(normalizedSearch) ||
					contract.elevators.some((elevator) => elevator.code.toLowerCase().includes(normalizedSearch))

				const matchesStatus =
					statusFilter === 'all' ||
					(statusFilter === 'active' && contract.status === 'active') ||
					(statusFilter === 'expired' && contract.status === 'expired')

				return matchesSearch && matchesStatus
			}),
		[contracts, searchValue, statusFilter],
	)

	const totalPages = Math.max(1, Math.ceil(filteredContracts.length / PAGE_SIZE))
	const activePage = Math.min(currentPage, totalPages)

	const paginatedContracts = useMemo(() => {
		const startIndex = (activePage - 1) * PAGE_SIZE
		return filteredContracts.slice(startIndex, startIndex + PAGE_SIZE)
	}, [activePage, filteredContracts])

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
		<div className="p-8 px-9 max-w-350 mx-auto min-h-screen bg-background text-foreground">
			<header className="flex items-start justify-between mb-7">
				<div>
					<div className="flex items-center gap-2.5 mb-1">
						<div className="w-9 h-9 bg-orange-50 border border-orange-200 rounded-2.25 flex items-center justify-center">
							<FileText className="w-4.5 h-4.5 text-primary" />
						</div>
						<h1 className="text-[26px] font-extrabold text-foreground">{t('contractManagementTitle')}</h1>
					</div>
					<p className="text-[13px] text-muted-foreground font-medium">{t('contractManagementDesc')}</p>
				</div>

				<AddContractDialog
					open={isAddDialogOpen}
					onOpenChange={setIsAddDialogOpen}
					formData={formData}
					setFormData={setFormData}
					errors={formErrors}
					setErrors={setFormErrors}
					allUsers={allUsers}
					allElevators={allElevators}
					onSubmit={handleAddContract}
				/>
			</header>

			<div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-5.5">
				<div className="bg-card border border-border/50 rounded-xl py-3.5 px-4 flex items-center gap-2.5">
					<div className="w-9 h-9 rounded-2.25 flex items-center justify-center shrink-0 bg-[#ecfdf5] text-[#10b981]">
						<CheckCircle className="w-4 h-4" />
					</div>
					<div>
						<div className="text-[18px] font-extrabold text-foreground leading-none">
							{contracts?.filter((c) => c.status === 'active').length || 0}
						</div>
						<div className="text-[11px] font-semibold text-muted-foreground mt-0.5">{t('contractActive')}</div>
					</div>
				</div>
				<div className="bg-card border border-border/50 rounded-xl py-3.5 px-4 flex items-center gap-2.5">
					<div className="w-9 h-9 rounded-2.25 flex items-center justify-center shrink-0 bg-muted text-muted-foreground">
						<FileX className="w-4 h-4" />
					</div>
					<div>
						<div className="text-[18px] font-extrabold text-foreground leading-none">
							{contracts?.filter((c) => c.status === 'expired').length || 0}
						</div>
						<div className="text-[11px] font-semibold text-muted-foreground mt-0.5">{t('contractExpired')}</div>
					</div>
				</div>
			</div>

			<div className="flex items-center gap-2.5 mb-4">
				<div className="flex items-center gap-2 bg-card border border-border/50 rounded-2.25 px-3.25 py-2 flex-1 max-w-80">
					<Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
					<Input
						value={searchValue}
						onChange={(e) => {
							setSearchValue(e.target.value)
							setCurrentPage(1)
						}}
						className="border-none outline-none font-inherit text-[13px] text-foreground bg-transparent flex-1 placeholder:text-muted-foreground"
						placeholder={t('searchCustomerPlaceholder')}
					/>
				</div>
				<Select
					value={statusFilter}
					onValueChange={(value) => {
						setStatusFilter(value)
						setCurrentPage(1)
					}}
				>
					<SelectTrigger className="w-auto min-w-35 bg-card border border-border/50 rounded-2.25 px-3 py-2 h-auto font-inherit text-[13px] font-semibold text-foreground">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">{t('allStatuses')}</SelectItem>
						<SelectItem value="active">{t('contractActive')}</SelectItem>
						<SelectItem value="expired">{t('contractExpired')}</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<ContractTable
				contracts={paginatedContracts}
				onView={handleViewContract}
				onEdit={openEditDialog}
				onDelete={handleDeleteContract}
				onElevatorClick={navigateToElevator}
				isDeleting={deleteContractMutation.isPending}
			/>

			<PaginationControls
				currentPage={activePage}
				totalItems={filteredContracts.length}
				pageSize={PAGE_SIZE}
				onPageChange={setCurrentPage}
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
					errors={formErrors}
					setErrors={setFormErrors}
					allUsers={allUsers}
					allElevators={allElevators}
					onSubmit={handleUpdateContract}
				/>
			)}

			<CommonConfirmDialog
				open={!!deletingContractId}
				onOpenChange={(open) => {
					if (!open) setDeletingContractId(null)
				}}
				title={t('delete')}
				content={t('confirmDelete')}
				cancelText={t('cancel')}
				submitText={deleteContractMutation.isPending ? t('deleting') : t('delete')}
				onSubmit={handleConfirmDeleteContract}
				isPending={deleteContractMutation.isPending}
			/>
		</div>
	)
}

export default ContractList
