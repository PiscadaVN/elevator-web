import { useState } from 'react'
import { toast } from 'sonner'

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
import { useChangePassword } from '@/hooks/api/useChangePassword'
import { useLanguage } from '@/i18n/LanguageContext'

interface ChangePasswordDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
}

export function ChangePasswordDialog({ open, onOpenChange }: Readonly<ChangePasswordDialogProps>) {
	const { t } = useLanguage()
	const changePasswordMutation = useChangePassword()

	const [formData, setFormData] = useState({
		oldPassword: '',
		newPassword: '',
		confirmPassword: '',
	})

	const [errors, setErrors] = useState<Record<string, string>>({})

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {}

		if (!formData.oldPassword) {
			newErrors.oldPassword = t('missingRequiredFields')
		}
		if (!formData.newPassword) {
			newErrors.newPassword = t('missingRequiredFields')
		}
		if (!formData.confirmPassword) {
			newErrors.confirmPassword = t('missingRequiredFields')
		}

		if (formData.newPassword && formData.confirmPassword && formData.newPassword !== formData.confirmPassword) {
			newErrors.confirmPassword = t('passwordsDoNotMatch')
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSubmit = async () => {
		if (!validateForm()) return

		try {
			await changePasswordMutation.mutateAsync({
				oldPassword: formData.oldPassword,
				newPassword: formData.newPassword,
			})

			toast.success(t('passwordChangedSuccessfully'))
			resetForm()
			onOpenChange(false)
		} catch {
			toast.error(t('failedToChangePassword'))
		}
	}

	const resetForm = () => {
		setFormData({
			oldPassword: '',
			newPassword: '',
			confirmPassword: '',
		})
		setErrors({})
	}

	const handleClose = () => {
		resetForm()
		onOpenChange(false)
	}

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t('changePassword')}</DialogTitle>
					<DialogDescription>{t('changePasswordDesc')}</DialogDescription>
				</DialogHeader>

				<div className="grid gap-4 py-4">
					<div className="space-y-2">
						<Label htmlFor="oldPassword">{t('currentPassword')}</Label>
						<Input
							id="oldPassword"
							type="password"
							value={formData.oldPassword}
							onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
							placeholder="••••••"
							aria-invalid={!!errors.oldPassword}
						/>
						{errors.oldPassword && <p className="text-xs text-destructive">{errors.oldPassword}</p>}
					</div>

					<div className="space-y-2">
						<Label htmlFor="newPassword">{t('newPassword')}</Label>
						<Input
							id="newPassword"
							type="password"
							value={formData.newPassword}
							onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
							placeholder="••••••"
							aria-invalid={!!errors.newPassword}
						/>
						{errors.newPassword && <p className="text-xs text-destructive">{errors.newPassword}</p>}
					</div>

					<div className="space-y-2">
						<Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
						<Input
							id="confirmPassword"
							type="password"
							value={formData.confirmPassword}
							onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
							placeholder="••••••"
							aria-invalid={!!errors.confirmPassword}
						/>
						{errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
					</div>
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={handleClose} disabled={changePasswordMutation.isPending}>
						{t('cancel')}
					</Button>
					<Button onClick={handleSubmit} disabled={changePasswordMutation.isPending}>
						{changePasswordMutation.isPending ? t('saving') : t('confirm')}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
