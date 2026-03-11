import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useLanguage } from '@/i18n/LanguageContext'
import { UserRoles } from '@/lib/role-utils'
import type { User, UserRole } from '@/types/api'

interface EditUserDialogProps {
	user: User | null
	onClose: () => void
	formData: Partial<User>
	setFormData: (data: Partial<User>) => void
	onSubmit: () => void
	isPending?: boolean
}

export function EditUserDialog({ user, onClose, formData, setFormData, onSubmit, isPending }: EditUserDialogProps) {
	const { t } = useLanguage()

	const showPhoneField = formData.role === UserRoles.USER
	const showEmailField = formData.role !== UserRoles.USER
	const showOldContractHistoryPermission = formData.role === UserRoles.USER

	return (
		<Dialog open={!!user} onOpenChange={(open) => !open && onClose()}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{t('edit')}: {user?.fullName}
					</DialogTitle>
					<DialogDescription>{t('userManagementDesc')}</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="space-y-2">
						<Label>{t('fullName')}</Label>
						<Input value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
					</div>
					<div className="space-y-2">
						<Label>{t('role')}</Label>
						<Select
							value={formData.role}
							onValueChange={(role) => {
								if (!role) {
									return
								}

								setFormData({ ...formData, role: role as UserRole })
							}}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value={UserRoles.ADMIN}>{t('admin')}</SelectItem>
								<SelectItem value={UserRoles.OPERATOR}>{t('operator')}</SelectItem>
								<SelectItem value={UserRoles.USER}>{t('user')}</SelectItem>
							</SelectContent>
						</Select>
					</div>
					{showEmailField && (
						<div className="space-y-2">
							<Label>{t('email')}</Label>
							<Input
								value={formData.email}
								onChange={(e) => setFormData({ ...formData, email: e.target.value })}
								disabled
							/>
						</div>
					)}
					{showPhoneField && (
						<div className="space-y-2">
							<Label>{t('phone')}</Label>
							<Input
								value={formData.phone}
								onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
								disabled
							/>
						</div>
					)}
					{showOldContractHistoryPermission && (
						<div className="flex items-center gap-2">
							<Input
								type="checkbox"
								checked={!!formData.canViewContractHistory}
								onChange={(e) => setFormData({ ...formData, canViewContractHistory: e.target.checked })}
								className="h-4 w-4"
							/>
							<Label>{t('allowViewOldContractHistory')}</Label>
						</div>
					)}
				</div>
				<DialogFooter>
					<Button onClick={onSubmit} disabled={isPending}>
						{isPending ? 'Saving...' : t('save')}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
