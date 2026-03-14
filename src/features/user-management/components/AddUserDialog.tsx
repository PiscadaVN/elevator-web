import { UserPlus } from 'lucide-react'

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
	errors: Partial<Record<'fullName' | 'email' | 'phone' | 'password', string>>
	setErrors: (errors: Partial<Record<'fullName' | 'email' | 'phone' | 'password', string>>) => void
	onSubmit: () => void
}

export function AddUserDialog({
	open,
	onOpenChange,
	formData,
	setFormData,
	errors,
	setErrors,
	onSubmit,
	isPending,
}: Readonly<AddUserDialogProps>) {
	const { t } = useLanguage()
	const showPhoneField = formData.role !== UserRoles.ADMIN
	const showEmailField = formData.role === UserRoles.ADMIN
	const showOldContractHistoryPermission = formData.role === UserRoles.USER

	return (
		<Dialog
			open={open}
			onOpenChange={(nextOpen) => {
				if (!nextOpen) {
					setErrors({})
				}
				onOpenChange(nextOpen)
			}}
		>
			<DialogTrigger asChild>
				<Button className="flex items-center gap-1.75 bg-primary text-white border-none rounded-2.5 py-2.5 px-4.5 text-[13px] font-bold cursor-pointer transition-all hover:bg-orange-600 whitespace-nowrap">
					<UserPlus className="w-3.75 h-3.75" /> {t('addUser')}
				</Button>
			</DialogTrigger>

			<DialogContent className="max-w-130 max-h-[90vh] overflow-y-auto bg-card rounded-4.5 p-7 border-none shadow-[0_20px_60px_rgba(0,0,0,0.15)] gap-0">
				<DialogHeader className="mb-5 text-left flex-row justify-between items-start space-y-0">
					<div>
						<DialogTitle className="text-[17px] font-extrabold text-foreground">{t('addUser')}</DialogTitle>
						<DialogDescription className="text-[12px] text-muted-foreground mt-0.5">
							{t('userManagementDesc')}
						</DialogDescription>
					</div>
				</DialogHeader>

				<div className="py-2">
					<div className="grid grid-cols-2 gap-3 mb-3.5">
						<div>
							<Label className="text-[11px] font-bold text-muted-foreground mb-1.25 block uppercase tracking-[0.4px]">
								{t('fullName')} *
							</Label>
							<Input
								value={formData.fullName}
								onChange={(e) => {
									setFormData({ ...formData, fullName: e.target.value })
									if (errors.fullName) {
										setErrors({ ...errors, fullName: undefined })
									}
								}}
								placeholder="John Doe"
								className="w-full bg-background border-border rounded-2.25 px-3 py-2.5 h-auto text-[13px] font-inherit text-foreground outline-none transition-colors focus-visible:border-primary focus-visible:ring-0"
							/>
							{errors.fullName ? <p className="mt-1 text-xs text-destructive">{errors.fullName}</p> : null}
						</div>

						<div>
							<Label className="text-[11px] font-bold text-muted-foreground mb-1.25 block uppercase tracking-[0.4px]">
								{t('role')} *
							</Label>
							<Select
								value={formData.role}
								onValueChange={(value) => {
									const nextType = value

									if (nextType === UserRoles.USER || nextType === UserRoles.ADMIN || nextType === UserRoles.OPERATOR) {
										setFormData({ ...formData, role: nextType, email: '' })
										setErrors({ ...errors, email: undefined, phone: undefined })
									}
								}}
							>
								<SelectTrigger className="w-full bg-background border-border rounded-2.25 px-3 py-2.5 h-auto text-[13px] font-inherit text-foreground outline-none transition-colors focus-visible:border-primary focus-visible:ring-0">
									<SelectValue placeholder={t('selectRole')} />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="admin">{t('admin')}</SelectItem>
									<SelectItem value="operator">{t('operator')}</SelectItem>
									<SelectItem value="user">{t('user')}</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					{(showEmailField || showPhoneField) && (
						<div className="gap-3 mb-3.5">
							{showEmailField && (
								<div>
									<Label className="text-[11px] font-bold text-muted-foreground mb-1.25 block uppercase tracking-[0.4px]">
										{t('email')} *
									</Label>
									<Input
										type="email"
										value={formData.email}
										onChange={(e) => {
											setFormData({ ...formData, email: e.target.value })
											if (errors.email) {
												setErrors({ ...errors, email: undefined })
											}
										}}
										placeholder="john@example.com"
										className="w-full bg-background border-border rounded-2.25 px-3 py-2.5 h-auto text-[13px] font-inherit text-foreground outline-none transition-colors focus-visible:border-primary focus-visible:ring-0"
									/>
									{errors.email ? <p className="mt-1 text-xs text-destructive">{errors.email}</p> : null}
								</div>
							)}

							{showPhoneField && (
								<div>
									<Label className="text-[11px] font-bold text-muted-foreground mb-1.25 block uppercase tracking-[0.4px]">
										{t('phone')} *
									</Label>
									<Input
										value={formData.phone}
										onChange={(e) => {
											setFormData({ ...formData, phone: e.target.value })
											if (errors.phone) {
												setErrors({ ...errors, phone: undefined })
											}
										}}
										placeholder="0xxx"
										className="w-full bg-background border-border rounded-2.25 px-3 py-2.5 h-auto text-[13px] font-inherit text-foreground outline-none transition-colors focus-visible:border-primary focus-visible:ring-0"
									/>
									{errors.phone ? <p className="mt-1 text-xs text-destructive">{errors.phone}</p> : null}
								</div>
							)}
						</div>
					)}

					<div className="gap-3 mb-3.5">
						<div className="col-span-1">
							<Label className="text-[11px] font-bold text-muted-foreground mb-1.25 block uppercase tracking-[0.4px]">
								{t('passwordLabel')} *
							</Label>
							<Input
								value={formData.password}
								onChange={(e) => {
									setFormData({ ...formData, password: e.target.value })
									if (errors.password) {
										setErrors({ ...errors, password: undefined })
									}
								}}
								placeholder="••••••••"
								className="w-full bg-background border-border rounded-2.25 px-3 py-2.5 h-auto text-[13px] font-inherit text-foreground outline-none transition-colors focus-visible:border-primary focus-visible:ring-0"
							/>
							{errors.password ? <p className="mt-1 text-xs text-destructive">{errors.password}</p> : null}
						</div>
					</div>

					{showOldContractHistoryPermission && (
						<div className="mb-3.5">
							<div className="bg-background border-border rounded-xl py-3.5 mt-1">
								<div className="flex items-center gap-2">
									<Input
										id="allowViewOldContractHistory"
										type="checkbox"
										checked={!!formData.canViewContractHistory}
										onChange={(e) => setFormData({ ...formData, canViewContractHistory: e.target.checked })}
										className="accent-primary w-3.5 h-3.5 shrink-0"
									/>
									<Label
										htmlFor="allowViewOldContractHistory"
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
						onClick={() => onOpenChange(false)}
						className="py-2.25 px-5 rounded-2.25 border-border bg-background text-[13px] font-bold text-muted-foreground hover:bg-muted/50 transition-colors"
					>
						{t('cancel')}
					</Button>
					<Button
						onClick={onSubmit}
						disabled={isPending}
						className="py-2.25 px-5.5 rounded-2.25 border-none bg-primary text-white text-[13px] font-bold transition-colors hover:bg-orange-600 disabled:opacity-50"
					>
						{isPending ? t('creating') : t('confirm')}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
