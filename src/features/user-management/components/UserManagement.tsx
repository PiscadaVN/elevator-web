import { Users } from 'lucide-react'
import { useState } from 'react'

import { useCreateUser, useDeleteUser, useUpdateUser, useUsers } from '@/hooks/api/useUser'
import { useLanguage } from '@/i18n/LanguageContext'
import { UserRoles } from '@/lib/role-utils'
import type { User, UserCreate, UserUpdate } from '@/types/api'

import { AddUserDialog } from './AddUserDialog'
import { EditUserDialog } from './EditUserDialog'
import { UserTable } from './UserTable'

export function UserManagement() {
	const { t } = useLanguage()

	const { data: users = [], isLoading } = useUsers()
	const createMutation = useCreateUser()
	const updateMutation = useUpdateUser()
	const deleteMutation = useDeleteUser()

	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
	const [editingUser, setEditingUser] = useState<User | null>(null)

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
		if (!formData.fullName || !formData.password) {
			alert(t('missingRequiredFields'))
			return
		}

		const role = formData.role || UserRoles.USER
		const isAdminRole = role === UserRoles.ADMIN

		if (users.some((u) => (isAdminRole ? u.phone === formData.phone : u.email === formData.email))) {
			alert(t('emailOrPhoneExists'))
			return
		}

		try {
			const newUserData: UserCreate = {
				fullName: formData.fullName,
				email: isAdminRole ? (formData.email ?? '') : `${formData.phone}@example.com`,
				phone: isAdminRole ? '' : (formData.phone ?? ''),
				password: formData.password,
				role,
				canViewContractHistory: role === UserRoles.USER ? !!formData.canViewContractHistory : false,
			}

			await createMutation.mutateAsync(newUserData)
			setIsAddDialogOpen(false)
			resetForm()
		} catch (_error) {
			alert(t('failedToCreateUser'))
		}
	}

	const handleUpdateUser = async () => {
		if (!editingUser) return

		const role = formData.role || UserRoles.USER
		const isAdminRole = role === UserRoles.ADMIN

		try {
			const updateData: UserUpdate = {
				fullName: formData.fullName,
				email: isAdminRole ? (formData.email ?? '') : `${formData.phone}@example.com`,
				phone: isAdminRole ? '' : (formData.phone ?? ''),
				role,
				isActive: formData.isActive,
				canViewContractHistory: role === UserRoles.USER ? !!formData.canViewContractHistory : false,
			}

			await updateMutation.mutateAsync({ userId: editingUser.id, data: updateData })
			setEditingUser(null)
			resetForm()
		} catch (_error) {
			alert(t('failedToUpdateUser'))
		}
	}

	const handleToggleStatus = async (id: string) => {
		if (!confirm(t('confirmDeleteUser'))) return

		try {
			await deleteMutation.mutateAsync(id)
		} catch (_error) {
			alert(t('failedToToggleUserStatus'))
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
	}

	const openEditDialog = (user: User) => {
		setEditingUser(user)
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

	return (
		<div className="p-8 space-y-8 max-w-7xl mx-auto">
			<header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
				<div>
					<h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
						<Users className="w-10 h-10 text-primary" />
						{t('userManagementTitle')}
					</h1>
					<p className="text-muted-foreground mt-2">{t('userManagementDesc')}</p>
				</div>
				<AddUserDialog
					open={isAddDialogOpen}
					onOpenChange={setIsAddDialogOpen}
					formData={formData}
					setFormData={setFormData}
					onSubmit={handleAddUser}
					isPending={createMutation.isPending}
				/>
			</header>

			<UserTable users={users} isLoading={isLoading} onEdit={openEditDialog} onToggleStatus={handleToggleStatus} />

			<EditUserDialog
				user={editingUser}
				onClose={() => {
					setEditingUser(null)
					resetForm()
				}}
				formData={formData}
				setFormData={setFormData}
				onSubmit={handleUpdateUser}
				isPending={updateMutation.isPending}
			/>
		</div>
	)
}
