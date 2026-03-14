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
	errors: Partial<Record<'fullName' | 'email' | 'phone', string>>
	setErrors: (errors: Partial<Record<'fullName' | 'email' | 'phone', string>>) => void
	onSubmit: () => void
	isPending?: boolean
}

export function EditUserDialog({
	user,
	onClose,
	formData,
	setFormData,
	errors,
	setErrors,
	onSubmit,
	isPending,
}: Readonly<EditUserDialogProps>) {
	const { t } = useLanguage()

	const showPhoneField = formData.role !== UserRoles.ADMIN
	const showEmailField = formData.role === UserRoles.ADMIN
	const showOldContractHistoryPermission = formData.role === UserRoles.USER

	return (
		<Dialog
			open={!!user}
			onOpenChange={(open) => {
				if (!open) {
					setErrors({})
					onClose()
				}
			}}
		>
			<DialogContent className="max-w-130 max-h-[90vh] overflow-y-auto bg-card rounded-4.5 p-7 border-none shadow-[0_20px_60px_rgba(0,0,0,0.15)] gap-0">
				<DialogHeader className="mb-5 text-left flex-row justify-between items-start space-y-0">
					<div>
						<DialogTitle className="text-[17px] font-extrabold text-foreground">
							{t('edit')}: {user?.fullName}
						</DialogTitle>
						<DialogDescription className="text-[12px] text-muted-foreground mt-0.5">
							{t('userManagementDesc')}
						</DialogDescription>
					</div>
				</DialogHeader>

				<div className="py-2">
					<div className="grid grid-cols-2 gap-3 mb-3.5">
						<div>
							<Label className="text-[11px] font-bold text-muted-foreground mb-1.25 block uppercase tracking-[0.4px]">
								{t('fullName')}
							</Label>
							<Input
								value={formData.fullName}
								onChange={(e) => {
									setFormData({ ...formData, fullName: e.target.value })
									if (errors.fullName) {
										setErrors({ fullName: undefined })
									}
								}}
								className="w-full bg-background border-border rounded-2.25 px-3 py-2.5 h-auto text-[13px] font-inherit text-foreground outline-none transition-colors focus-visible:border-primary focus-visible:ring-0"
							/>
							{errors.fullName ? <p className="mt-1 text-xs text-destructive">{errors.fullName}</p> : null}
						</div>
						<div>
							<Label className="text-[11px] font-bold text-muted-foreground mb-1.25 block uppercase tracking-[0.4px]">
								{t('role')}
							</Label>
							<Select
								value={formData.role}
								disabled
								onValueChange={(role) => {
									if (!role) {
										return
									}

									setFormData({ ...formData, role: role as UserRole })
								}}
							>
								<SelectTrigger className="w-full bg-background border-border rounded-2.25 px-3 py-2.5 h-auto text-[13px] font-inherit text-foreground outline-none transition-colors focus-visible:border-primary focus-visible:ring-0 disabled:opacity-50">
									<SelectValue placeholder={t('selectRole')} />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value={UserRoles.ADMIN}>{t('admin')}</SelectItem>
									<SelectItem value={UserRoles.OPERATOR}>{t('operator')}</SelectItem>
									<SelectItem value={UserRoles.USER}>{t('user')}</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					{(showEmailField || showPhoneField) && (
						<div className="grid grid-cols-2 gap-3 mb-3.5">
							{showEmailField && (
								<div>
									<Label className="text-[11px] font-bold text-muted-foreground mb-1.25 block uppercase tracking-[0.4px]">
										{t('email')}
									</Label>
									<Input
										value={formData.email}
										onChange={(e) => {
											setFormData({ ...formData, email: e.target.value })
											if (errors.email) {
												setErrors({ ...errors, email: undefined })
											}
										}}
										disabled
										className="w-full bg-background border-border rounded-2.25 px-3 py-2.5 h-auto text-[13px] font-inherit text-foreground outline-none transition-colors focus-visible:border-primary focus-visible:ring-0 disabled:opacity-50"
									/>
									{errors.email ? <p className="mt-1 text-xs text-destructive">{errors.email}</p> : null}
								</div>
							)}
							{showPhoneField && (
								<div>
									<Label className="text-[11px] font-bold text-muted-foreground mb-1.25 block uppercase tracking-[0.4px]">
										{t('phone')}
									</Label>
									<Input
										value={formData.phone}
										onChange={(e) => {
											setFormData({ ...formData, phone: e.target.value })
											if (errors.phone) {
												setErrors({ ...errors, phone: undefined })
											}
										}}
										disabled
										className="w-full bg-background border-border rounded-2.25 px-3 py-2.5 h-auto text-[13px] font-inherit text-foreground outline-none transition-colors focus-visible:border-primary focus-visible:ring-0 disabled:opacity-50"
									/>
									{errors.phone ? <p className="mt-1 text-xs text-destructive">{errors.phone}</p> : null}
								</div>
							)}
						</div>
					)}

					{showOldContractHistoryPermission && (
						<div className="mb-3.5">
							<div className="bg-background border-border rounded-xl py-3.5 mt-1">
								<div className="flex items-center gap-2">
									<Input
										id="editAllowViewOldContractHistory"
										type="checkbox"
										checked={!!formData.canViewContractHistory}
										onChange={(e) => setFormData({ ...formData, canViewContractHistory: e.target.checked })}
										className="accent-primary w-3.5 h-3.5 shrink-0"
									/>
									<Label
										htmlFor="editAllowViewOldContractHistory"
										className="text-[12px] font-semibold text-foreground cursor-pointer m-0"
									>
										{t('allowViewOldContractHistory')}
									</Label>
								</div>
							</div>
						</div>
					)}
				</div>
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
						disabled={isPending}
						className="py-2.25 px-5.5 rounded-2.25 border-none bg-primary text-white text-[13px] font-bold transition-colors hover:bg-orange-600 disabled:opacity-50"
					>
						{isPending ? t('saving') : t('save')}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
