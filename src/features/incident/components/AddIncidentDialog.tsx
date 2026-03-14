import { Paperclip, Plus, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { getPriorityLabel, IncidentPriorityEnum } from '@/features/incident/helpers/status-transition'
import { useLanguage } from '@/i18n/LanguageContext'
import type { Elevator, IncidentFormData } from '@/types/api'

interface AddIncidentDialogProps {
	open: boolean
	formData: IncidentFormData
	errors: Partial<Record<'elevatorId' | 'title' | 'description', string>>
	elevators: Elevator[]
	isPending?: boolean
	setFormData: (data: IncidentFormData) => void
	setErrors: (errors: Partial<Record<'elevatorId' | 'title' | 'description', string>>) => void
	onSelectFiles: (files: FileList | null) => void
	onRemoveAttachment: (index: number) => void
	onSubmit: () => void
	onOpenChange: (open: boolean) => void
}

export function AddIncidentDialog({
	open,
	onOpenChange,
	formData,
	errors,
	setErrors,
	setFormData,
	elevators,
	onSubmit,
	onSelectFiles,
	onRemoveAttachment,
	isPending,
}: Readonly<AddIncidentDialogProps>) {
	const { t } = useLanguage()

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogTrigger asChild>
				<Button className="flex items-center gap-1.75 bg-primary text-white border-none rounded-2.5 py-2.5 px-4.5 text-[13px] font-bold cursor-pointer transition-all hover:bg-orange-600 whitespace-nowrap outline-none">
					<Plus className="w-3.75 h-3.75" /> {t('reportIncident')}
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-125 bg-card rounded-4.5 p-7 border-none shadow-[0_20px_60px_rgba(0,0,0,0.15)] gap-0 [&>button]:hidden">
				<DialogHeader className="mb-5 text-left flex-row justify-between items-start space-y-0">
					<div>
						<DialogTitle className="text-[17px] font-extrabold text-foreground">{t('reportIncident')}</DialogTitle>
						<DialogDescription className="text-[12px] text-muted-foreground mt-0.5">
							{t('createIncidentDesc')}
						</DialogDescription>
					</div>
					<Button
						variant="outline"
						size="icon"
						onClick={() => {
							setErrors({})
							onOpenChange(false)
						}}
						className="w-7.5 h-7.5 rounded-1.75 border border-border bg-transparent flex items-center justify-center text-muted-foreground hover:bg-muted transition-all cursor-pointer outline-none"
					>
						<X className="w-3.5 h-3.5" />
					</Button>
				</DialogHeader>

				<div className="space-y-3.5">
					<div className="space-y-1.25">
						<Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.4px]">
							{t('incidentTitle')} *
						</Label>
						<Input
							value={formData.title}
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

					<div className="space-y-1.25">
						<Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.4px]">
							{t('elevator')} *
						</Label>
						<Select
							value={formData.elevatorId}
							onValueChange={(v) => {
								setFormData({ ...formData, elevatorId: v } as IncidentFormData)
								if (errors.elevatorId) {
									setErrors({ ...errors, elevatorId: undefined })
								}
							}}
						>
							<SelectTrigger className="w-full h-auto px-3 py-2.5 bg-muted/30 border-border rounded-2.25 text-[13px] text-foreground focus:ring-0 focus:border-primary transition-colors">
								<SelectValue placeholder={t('selectElevatorPlaceholder')} />
							</SelectTrigger>
							<SelectContent>
								{elevators.map((el) => (
									<SelectItem key={el.id} value={el.id}>
										{el.code} - {el.address}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{errors.elevatorId ? <p className="text-xs text-destructive">{errors.elevatorId}</p> : null}
					</div>

					<div className="space-y-1.25">
						<Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.4px]">
							{t('priority')} *
						</Label>
						<Select
							value={formData.priority.toString()}
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
							{t('issueDescription')} *
						</Label>
						<Textarea
							value={formData.description ?? ''}
							onChange={(e) => {
								setFormData({ ...formData, description: e.target.value })
								if (errors.description) {
									setErrors({ ...errors, description: undefined })
								}
							}}
							placeholder={t('describeProblemPlaceholder')}
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
									className="px-3 py-2 rounded-2.25 border-border text-[12px] font-semibold"
									onClick={() => document.getElementById('incident-add-attachments')?.click()}
								>
									<Paperclip className="w-3.5 h-3.5" />
									{t('addAttachment')}
								</Button>
								<input
									id="incident-add-attachments"
									type="file"
									multiple
									className="hidden"
									onChange={(event) => {
										onSelectFiles(event.target.files)
										event.currentTarget.value = ''
									}}
								/>
							</div>
							{formData.attachments.length === 0 ? (
								<p className="text-xs text-muted-foreground">{t('noFiles')}</p>
							) : (
								<div className="space-y-1.5">
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
							)}
						</div>
					</div>
				</div>

				<div className="flex gap-2.25 mt-5 justify-end">
					<Button
						variant="outline"
						onClick={() => {
							setErrors({})
							onOpenChange(false)
						}}
						className="px-5 py-2.25 rounded-2.25 border-border bg-muted/30 text-[13px] font-bold text-muted-foreground cursor-pointer hover:bg-muted transition-colors outline-none"
					>
						{t('cancel')}
					</Button>
					<Button
						onClick={onSubmit}
						disabled={isPending}
						className="px-5.5 py-2.25 rounded-2.25 border-none bg-primary text-white text-[13px] font-bold cursor-pointer hover:bg-orange-600 transition-colors outline-none disabled:opacity-50"
					>
						{isPending ? t('creating') : t('confirmAdd')}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	)
}
