import { HardHat, Search, ShieldCheck, User as UserIcon, Users } from 'lucide-react'
import { useMemo, useState } from 'react'

import { CommonConfirmDialog } from '@/components/ui/common-confirm-dialog'
import { Input } from '@/components/ui/input'
import { PaginationControls } from '@/components/ui/pagination-controls'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCreateUser, useDeleteUser, useUpdateUser, useUsers } from '@/hooks/api/useUser'
import { useLanguage } from '@/i18n/LanguageContext'
import { UserRoles } from '@/lib/role-utils'
import type { User, UserCreate, UserUpdate } from '@/types/api'

import { AddUserDialog } from './AddUserDialog'
import { EditUserDialog } from './EditUserDialog'
import { UserTable } from './UserTable'

const PAGE_SIZE = 10
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_REGEX = /^(?:\+84|0)\d{9,10}$/

type AddUserErrors = Partial<Record<'fullName' | 'email' | 'phone' | 'password', string>>
type EditUserErrors = Partial<Record<'fullName' | 'email' | 'phone', string>>

interface UserValidationResult {
	errors: AddUserErrors
	trimmedEmail: string
	trimmedPhone: string
	role: User['role']
	isAdminRole: boolean
}

function validateUserForm(
	formData: Partial<User>,
	t: (key: string) => string,
	requirePassword: boolean,
): UserValidationResult {
	const errors: AddUserErrors = {}
	const trimmedEmail = formData.email?.trim() ?? ''
	const trimmedPhone = formData.phone?.trim() ?? ''
	const role = formData.role || UserRoles.USER
	const isAdminRole = role === UserRoles.ADMIN

	if (!formData.fullName?.trim()) {
		errors.fullName = t('missingRequiredFields')
	}

	if (requirePassword && !formData.password?.trim()) {
		errors.password = t('missingRequiredFields')
	}

	if (isAdminRole && !trimmedEmail) {
		errors.email = t('missingEmail')
	}

	if (!isAdminRole && !trimmedPhone) {
		errors.phone = t('missingPhone')
	}

	if (isAdminRole && trimmedEmail && !EMAIL_REGEX.test(trimmedEmail)) {
		errors.email = t('invalidEmailFormat')
	}

	if (!isAdminRole && trimmedPhone && !PHONE_REGEX.test(trimmedPhone)) {
		errors.phone = t('invalidPhoneFormat')
	}

	return {
		errors,
		trimmedEmail,
		trimmedPhone,
		role,
		isAdminRole,
	}
}

export function UserManagement() {
	const { t } = useLanguage()

	const { data: users = [], isLoading } = useUsers()
	const createMutation = useCreateUser()
	const updateMutation = useUpdateUser()
	const deleteMutation = useDeleteUser()

	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
	const [editingUser, setEditingUser] = useState<User | null>(null)
	const [deletingUserId, setDeletingUserId] = useState<string | null>(null)
	const [searchValue, setSearchValue] = useState('')
	const [roleFilter, setRoleFilter] = useState('all')
	const [statusFilter, setStatusFilter] = useState('all')
	const [currentPage, setCurrentPage] = useState(1)
	const [addFormErrors, setAddFormErrors] = useState<AddUserErrors>({})
	const [editFormErrors, setEditFormErrors] = useState<EditUserErrors>({})

	const [formData, setFormData] = useState<Partial<User>>({
		fullName: '',
		email: 'test@example.com',
		phone: '',
		role: UserRoles.USER,
		password: '',
		isActive: true,
		canViewContractHistory: false,
	})

	const handleAddUser = async () => {
		const { errors, trimmedEmail, trimmedPhone, role, isAdminRole } = validateUserForm(formData, t, true)

		if (Object.keys(errors).length > 0) {
			setAddFormErrors(errors)
			return
		}

		setAddFormErrors({})

		const fullName = formData.fullName?.trim() ?? ''
		const password = formData.password?.trim() ?? ''

		if (users.some((u) => (isAdminRole ? u.email === trimmedEmail : u.phone === trimmedPhone))) {
			setAddFormErrors(isAdminRole ? { email: t('emailExists') } : { phone: t('emailExists') })
			return
		}

		try {
			const newUserData: UserCreate = {
				fullName,
				email: isAdminRole ? trimmedEmail : `${trimmedPhone}@example.com`,
				phone: isAdminRole ? '' : trimmedPhone,
				password,
				role,
				canViewContractHistory: role === UserRoles.USER ? !!formData.canViewContractHistory : false,
			}

			await createMutation.mutateAsync(newUserData)
			setIsAddDialogOpen(false)
			resetForm()
		} catch {
			// Handled by mutation hook toast.
		}
	}

	const handleUpdateUser = async () => {
		if (!editingUser) return
		const { errors, trimmedEmail, trimmedPhone, role, isAdminRole } = validateUserForm(formData, t, false)

		if (Object.keys(errors).length > 0) {
			setEditFormErrors(errors as EditUserErrors)
			return
		}

		setEditFormErrors({})

		try {
			const updateData: UserUpdate = {
				fullName: formData.fullName,
				email: isAdminRole ? trimmedEmail : `${trimmedPhone}@example.com`,
				phone: isAdminRole ? '' : trimmedPhone,
				role,
				isActive: formData.isActive,
				canViewContractHistory: role === UserRoles.USER ? !!formData.canViewContractHistory : false,
			}

			await updateMutation.mutateAsync({ userId: editingUser.id, data: updateData })
			setEditingUser(null)
			resetForm()
		} catch {
			// Handled by mutation hook toast.
		}
	}

	const handleToggleStatus = (id: string) => {
		setDeletingUserId(id)
	}

	const handleConfirmToggleStatus = async () => {
		if (!deletingUserId) return

		try {
			await deleteMutation.mutateAsync(deletingUserId)
			setDeletingUserId(null)
		} catch {
			// Handled by mutation hook toast.
		}
	}

	const resetForm = () => {
		setFormData({
			fullName: '',
			email: '',
			phone: '',
			role: UserRoles.USER,
			password: '',
			isActive: true,
			canViewContractHistory: false,
		})
		setAddFormErrors({})
		setEditFormErrors({})
	}

	const openEditDialog = (user: User) => {
		setEditingUser(user)
		setEditFormErrors({})
		setFormData({
			fullName: user.fullName,
			email: user.email,
			phone: user.phone,
			role: user.role,
			password: user.password,
			isActive: user.isActive,
			canViewContractHistory: user.canViewContractHistory ?? false,
		})
	}

	const filteredUsers = useMemo(() => {
		const normalizedSearch = searchValue.trim().toLowerCase()

		return users.filter((user) => {
			const matchesSearch =
				normalizedSearch.length === 0 ||
				user.fullName.toLowerCase().includes(normalizedSearch) ||
				user.email.toLowerCase().includes(normalizedSearch) ||
				user.phone.toLowerCase().includes(normalizedSearch)

			const matchesRole = roleFilter === 'all' || user.role === roleFilter
			const matchesStatus =
				statusFilter === 'all' ||
				(statusFilter === 'active' && user.isActive) ||
				(statusFilter === 'disabled' && !user.isActive)

			return matchesSearch && matchesRole && matchesStatus
		})
	}, [users, searchValue, roleFilter, statusFilter])

	const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE))
	const activePage = Math.min(currentPage, totalPages)

	const paginatedUsers = useMemo(() => {
		const startIndex = (activePage - 1) * PAGE_SIZE
		return filteredUsers.slice(startIndex, startIndex + PAGE_SIZE)
	}, [activePage, filteredUsers])

	return (
		<div className="p-8 px-9 max-w-350 mx-auto min-h-screen bg-background text-foreground">
			<header className="flex items-start justify-between mb-7">
				<div>
					<div className="flex items-center gap-2.5 mb-1">
						<div className="w-9 h-9 bg-orange-50 border border-orange-200 rounded-2.25 flex items-center justify-center">
							<Users className="w-4.5 h-4.5 text-primary" />
						</div>
						<h1 className="text-[26px] font-extrabold text-foreground">{t('userManagementTitle')}</h1>
					</div>
					<p className="text-[13px] text-muted-foreground font-medium">{t('userManagementDesc')}</p>
				</div>
				<AddUserDialog
					open={isAddDialogOpen}
					onOpenChange={setIsAddDialogOpen}
					formData={formData}
					setFormData={setFormData}
					errors={addFormErrors}
					setErrors={setAddFormErrors}
					onSubmit={handleAddUser}
					isPending={createMutation.isPending}
				/>
			</header>

			<div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-5.5">
				<div className="bg-card border border-border/50 rounded-xl py-3.5 px-4 flex items-center gap-2.5">
					<div className="w-9 h-9 rounded-2.25 flex items-center justify-center shrink-0 bg-green-50 text-green-700">
						<Users className="w-4 h-4" />
					</div>
					<div>
						<div className="text-[18px] font-extrabold text-foreground leading-none">{users.length}</div>
						<div className="text-[11px] font-semibold text-muted-foreground mt-0.5">{t('allUsers')}</div>
					</div>
				</div>
				<div className="bg-card border border-border/50 rounded-xl py-3.5 px-4 flex items-center gap-2.5">
					<div className="w-9 h-9 rounded-2.25 flex items-center justify-center shrink-0 bg-[#fff7ed] text-[#ea580c]">
						<ShieldCheck className="w-4 h-4" />
					</div>
					<div>
						<div className="text-[18px] font-extrabold text-foreground leading-none">
							{users.filter((u) => u.role === UserRoles.ADMIN).length}
						</div>
						<div className="text-[11px] font-semibold text-muted-foreground mt-0.5">{t('admin')}</div>
					</div>
				</div>
				<div className="bg-card border border-border/50 rounded-xl py-3.5 px-4 flex items-center gap-2.5">
					<div className="w-9 h-9 rounded-2.25 flex items-center justify-center shrink-0 bg-[#eff6ff] text-[#2563eb]">
						<HardHat className="w-4 h-4" />
					</div>
					<div>
						<div className="text-[18px] font-extrabold text-foreground leading-none">
							{users.filter((u) => u.role === UserRoles.OPERATOR).length}
						</div>
						<div className="text-[11px] font-semibold text-muted-foreground mt-0.5">{t('operator')}</div>
					</div>
				</div>
				<div className="bg-card border border-border/50 rounded-xl py-3.5 px-4 flex items-center gap-2.5">
					<div className="w-9 h-9 rounded-2.25 flex items-center justify-center shrink-0 bg-[#f3f4f6] text-[#374151]">
						<UserIcon className="w-4 h-4" />
					</div>
					<div>
						<div className="text-[18px] font-extrabold text-foreground leading-none">
							{users.filter((u) => u.role === UserRoles.USER).length}
						</div>
						<div className="text-[11px] font-semibold text-muted-foreground mt-0.5">{t('user')}</div>
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
						placeholder={t('searchUserPlaceholder')}
					/>
				</div>
				<Select
					value={roleFilter}
					onValueChange={(value) => {
						setRoleFilter(value)
						setCurrentPage(1)
					}}
				>
					<SelectTrigger className="w-auto min-w-35 bg-card border border-border/50 rounded-2.25 px-3 py-2 h-auto font-inherit text-[13px] font-semibold text-foreground">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">{t('allRoles')}</SelectItem>
						<SelectItem value="admin">{t('admin')}</SelectItem>
						<SelectItem value="operator">{t('operator')}</SelectItem>
						<SelectItem value="user">{t('user')}</SelectItem>
					</SelectContent>
				</Select>
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
						<SelectItem value="active">{t('active')}</SelectItem>
						<SelectItem value="disabled">{t('disabled')}</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<UserTable
				users={paginatedUsers}
				isLoading={isLoading}
				onEdit={openEditDialog}
				onToggleStatus={handleToggleStatus}
			/>

			<PaginationControls
				currentPage={activePage}
				totalItems={filteredUsers.length}
				pageSize={PAGE_SIZE}
				onPageChange={setCurrentPage}
			/>

			<EditUserDialog
				user={editingUser}
				onClose={() => {
					setEditingUser(null)
					resetForm()
				}}
				formData={formData}
				setFormData={setFormData}
				errors={editFormErrors}
				setErrors={setEditFormErrors}
				onSubmit={handleUpdateUser}
				isPending={updateMutation.isPending}
			/>

			<CommonConfirmDialog
				open={!!deletingUserId}
				onOpenChange={(open) => {
					if (!open) setDeletingUserId(null)
				}}
				title={t('delete')}
				content={t('confirmDeleteUser')}
				cancelText={t('cancel')}
				submitText={deleteMutation.isPending ? t('deleting') : t('delete')}
				onSubmit={handleConfirmToggleStatus}
				isPending={deleteMutation.isPending}
			/>
		</div>
	)
}
