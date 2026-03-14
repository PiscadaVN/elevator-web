import { Paperclip, Trash2, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
	getNextIncidentStatuses,
	getPriorityLabel,
	getStatusLabel,
	IncidentPriorityEnum,
} from '@/features/incident/helpers/status-transition'
import { useLanguage } from '@/i18n/LanguageContext'
import type { File, Incident, IncidentFormData, IncidentStatus } from '@/types/api'

interface EditIncidentDialogProps {
	open: boolean
	incident: Incident | null
	isLoading?: boolean
	onClose: () => void
	formData: IncidentFormData
	setFormData: (data: IncidentFormData) => void
	errors: Partial<Record<'title' | 'description', string>>
	setErrors: (errors: Partial<Record<'title' | 'description', string>>) => void
	existingAttachments: File[]
	onSelectFiles: (files: FileList | null) => void
	onRemoveAttachment: (index: number) => void
	onRemoveExistingAttachment: (fileId: string) => void
	deletingExistingAttachmentId?: string | null
	onSubmit: () => void
	isPending?: boolean
}

export function EditIncidentDialog({
	open,
	incident,
	isLoading,
	onClose,
	formData,
	setFormData,
	errors,
	setErrors,
	existingAttachments,
	onSelectFiles,
	onRemoveAttachment,
	onRemoveExistingAttachment,
	deletingExistingAttachmentId,
	onSubmit,
	isPending,
}: Readonly<EditIncidentDialogProps>) {
	const { t } = useLanguage()
	const availableStatuses = incident ? getNextIncidentStatuses(incident.status) : []
	const hasExistingAttachments = existingAttachments.length > 0
	const hasNewAttachments = formData.attachments.length > 0
	const isFormDisabled = isLoading || !incident
	let newAttachmentsContent: React.ReactNode = null

	if (!hasExistingAttachments && !hasNewAttachments) {
		newAttachmentsContent = <p className="text-xs text-muted-foreground">{t('noFiles')}</p>
	} else if (hasNewAttachments) {
		newAttachmentsContent = (
			<div className="space-y-1.5">
				<p className="text-xs font-semibold text-muted-foreground">{t('newAttachments')}</p>
				{formData.attachments.map((attachment, index) => (
					<div
						key={`${attachment.fileName}-${index}`}
						className="flex items-center justify-between gap-2 rounded-xl border border-border bg-muted/20 px-2.5 py-2"
					>
						<div className="min-w-0 text-xs font-medium text-foreground truncate">{attachment.fileName}</div>
						<Button
							type="button"
							variant="ghost"
							size="icon"
							onClick={() => onRemoveAttachment(index)}
							className="h-6 w-6 rounded-md"
						>
							<X className="w-3.5 h-3.5" />
						</Button>
					</div>
				))}
			</div>
		)
	}

	return (
		<Dialog
			open={open}
			onOpenChange={(open) => {
				if (!open) {
					setErrors({})
					onClose()
				}
			}}
		>
			<DialogContent className="max-w-125 bg-card rounded-4.5 p-7 border-none shadow-[0_20px_60px_rgba(0,0,0,0.15)] gap-0 [&>button]:hidden">
				<DialogHeader className="mb-5 text-left flex-row justify-between items-start space-y-0">
					<div>
						<DialogTitle className="text-[17px] font-extrabold text-foreground">{t('edit')}</DialogTitle>
						<DialogDescription className="text-[12px] text-muted-foreground mt-0.5">
							{t('updateIncidentDesc')}
						</DialogDescription>
					</div>
					<Button
						variant="outline"
						size="icon"
						onClick={onClose}
						className="w-7.5 h-7.5 rounded-1.75 border border-border bg-transparent flex items-center justify-center text-muted-foreground hover:bg-muted transition-all cursor-pointer outline-none"
					>
						<X className="w-3.5 h-3.5" />
					</Button>
				</DialogHeader>

				<div className="space-y-3.5">
					{isLoading ? (
						<div className="rounded-2.25 border border-border bg-muted/20 px-3 py-2 text-[12px] font-medium text-muted-foreground">
							{t('loading')}
						</div>
					) : null}

					<div className="space-y-1.25">
						<Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.4px]">
							{t('incidentTitle')} *
						</Label>
						<Input
							value={formData.title}
							disabled={isFormDisabled}
							onChange={(e) => {
								setFormData({ ...formData, title: e.target.value })
								if (errors.title) {
									setErrors({ ...errors, title: undefined })
								}
							}}
							placeholder={t('incidentTitlePlaceholder')}
							className="w-full h-auto px-3 py-2.5 bg-muted/30 border-border rounded-2.25 text-[13px] text-foreground focus:ring-0 focus:border-primary transition-colors"
						/>
						{errors.title ? <p className="text-xs text-destructive">{errors.title}</p> : null}
					</div>

					<div className="grid grid-cols-2 gap-3">
						<div className="space-y-1.25">
							<Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.4px]">
								{t('priority')}
							</Label>
							<Select
								value={formData.priority.toString()}
								disabled={isFormDisabled}
								onValueChange={(v) => setFormData({ ...formData, priority: Number(v) })}
							>
								<SelectTrigger className="w-full h-auto px-3 py-2.5 bg-muted/30 border-border rounded-2.25 text-[13px] text-foreground focus:ring-0 focus:border-primary transition-colors">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{Object.values(IncidentPriorityEnum).map((priority) => (
										<SelectItem key={priority} value={priority.toString()}>
											{getPriorityLabel(priority, t)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-1.25">
							<Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.4px]">
								{t('status')}
							</Label>
							<Select
								value={formData.status}
								onValueChange={(v) => setFormData({ ...formData, status: v as IncidentStatus })}
								disabled={isFormDisabled || availableStatuses.length <= 1}
							>
								<SelectTrigger className="w-full h-auto px-3 py-2.5 bg-muted/30 border-border rounded-2.25 text-[13px] text-foreground focus:ring-0 focus:border-primary transition-colors">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{availableStatuses.map((status) => (
										<SelectItem key={status} value={status}>
											{getStatusLabel(status, t)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="space-y-1.25">
						<Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.4px]">
							{t('description')}
						</Label>
						<Textarea
							value={formData.description ?? ''}
							disabled={isFormDisabled}
							onChange={(e) => {
								setFormData({ ...formData, description: e.target.value })
								if (errors.description) {
									setErrors({ ...errors, description: undefined })
								}
							}}
							className="w-full min-h-25 bg-muted/30 border-border rounded-2.25 px-3 py-2.5 text-[13px] text-foreground outline-none focus:border-primary transition-colors resize-vertical font-inherit"
						/>
						{errors.description ? <p className="text-xs text-destructive">{errors.description}</p> : null}
					</div>

					<div className="space-y-1.25">
						<Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.4px]">
							{t('attachedFiles')}
						</Label>
						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<Button
									type="button"
									variant="outline"
									disabled={isFormDisabled}
									className="px-3 py-2 rounded-2.25 border-border text-[12px] font-semibold"
									onClick={() => document.getElementById('incident-edit-attachments')?.click()}
								>
									<Paperclip className="w-3.5 h-3.5" />
									{t('addAttachment')}
								</Button>
								<input
									id="incident-edit-attachments"
									type="file"
									multiple
									disabled={isFormDisabled}
									className="hidden"
									onChange={(event) => {
										onSelectFiles(event.target.files)
										event.currentTarget.value = ''
									}}
								/>
							</div>

							{hasExistingAttachments ? (
								<div className="space-y-1.5">
									<p className="text-xs font-semibold text-muted-foreground">{t('existingAttachments')}</p>
									{existingAttachments.map((attachment) => (
										<div
											key={attachment.id}
											className="flex items-center justify-between gap-2 rounded-xl border border-border bg-muted/20 px-2.5 py-2"
										>
											<div className="min-w-0 text-xs font-medium text-foreground truncate">
												{attachment.fileName || attachment.fileUrl}
											</div>
											<Button
												type="button"
												variant="ghost"
												size="icon"
												onClick={() => onRemoveExistingAttachment(attachment.id)}
												disabled={isFormDisabled || deletingExistingAttachmentId === attachment.id}
												className="h-6 w-6 rounded-md"
											>
												<Trash2 className="w-3.5 h-3.5" />
											</Button>
										</div>
									))}
								</div>
							) : null}

							{newAttachmentsContent}
						</div>
					</div>
				</div>

				<div className="flex gap-2.25 mt-5 justify-end">
					<Button
						variant="outline"
						onClick={onClose}
						className="px-5 py-2.25 rounded-2.25 border-border bg-muted/30 text-[13px] font-bold text-muted-foreground cursor-pointer hover:bg-muted transition-colors outline-none"
					>
						{t('cancel')}
					</Button>
					<Button
						onClick={onSubmit}
						disabled={isPending || isFormDisabled}
						className="px-5.5 py-2.25 rounded-2.25 border-none bg-primary text-white text-[13px] font-bold cursor-pointer hover:bg-orange-600 transition-colors outline-none disabled:opacity-50"
					>
						{isPending ? t('saving') : t('save')}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	)
}
