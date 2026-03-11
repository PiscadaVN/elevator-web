import { UserPlus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useLanguage } from '@/i18n/LanguageContext'
import { UserRoles } from '@/lib/role-utils'
import type { User } from '@/types/api'

interface AddUserDialogProps {
	open: boolean
	formData: Partial<User>
	isPending?: boolean
	onOpenChange: (open: boolean) => void
	setFormData: (data: Partial<User>) => void
	onSubmit: () => void
}

export function AddUserDialog({ open, onOpenChange, formData, setFormData, onSubmit, isPending }: AddUserDialogProps) {
	const { t } = useLanguage()
	const showPhoneField = formData.role !== UserRoles.ADMIN
	const showEmailField = formData.role === UserRoles.ADMIN
	const showOldContractHistoryPermission = formData.role === UserRoles.USER

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogTrigger asChild>
				<Button className="shadow-lg hover:shadow-primary/20 transition-all">
					<UserPlus className="w-4 h-4 mr-2" /> {t('addUser')}
				</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t('addUser')}</DialogTitle>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="space-y-2">
						<Label>{t('role')}</Label>
						<Select
							value={formData.role}
							onValueChange={(value) => {
								const nextType = value

								if (nextType === UserRoles.USER || nextType === UserRoles.ADMIN || nextType === UserRoles.OPERATOR) {
									setFormData({ ...formData, role: nextType, email: '' })
								}
							}}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="admin">{t('admin')}</SelectItem>
								<SelectItem value="operator">{t('operator')}</SelectItem>
								<SelectItem value="user">{t('user')}</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<Label>{t('fullName')}</Label>
						<Input
							value={formData.fullName}
							onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
							placeholder="John Doe"
						/>
					</div>

					{showEmailField && (
						<div className="space-y-2">
							<Label>{t('email')}</Label>
							<Input
								type="email"
								value={formData.email}
								onChange={(e) => setFormData({ ...formData, email: e.target.value })}
								placeholder="john@example.com"
							/>
						</div>
					)}

					{showPhoneField && (
						<div className="space-y-2">
							<Label>{t('phone')}</Label>
							<Input
								value={formData.phone}
								onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
								placeholder="0xxx"
							/>
						</div>
					)}

					{showOldContractHistoryPermission && (
						<div className="flex items-center gap-2">
							<Input
								id="allowViewOldContractHistory"
								type="checkbox"
								checked={!!formData.canViewContractHistory}
								onChange={(e) => setFormData({ ...formData, canViewContractHistory: e.target.checked })}
								className="h-4 w-4"
							/>
							<Label htmlFor="allowViewOldContractHistory">{t('allowViewOldContractHistory')}</Label>
						</div>
					)}

					<div className="space-y-2">
						<Label>{t('passwordLabel')}</Label>
						<Input
							value={formData.password}
							onChange={(e) => setFormData({ ...formData, password: e.target.value })}
							placeholder="***"
						/>
					</div>
				</div>
				<DialogFooter>
					<Button onClick={onSubmit} disabled={isPending}>
						{isPending ? t('creating') : t('confirm')}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
