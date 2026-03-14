import * as DialogPrimitive from '@radix-ui/react-dialog'
import { useNavigate } from '@tanstack/react-router'
import { X } from 'lucide-react'
import { useMemo } from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogOverlay, DialogPortal } from '@/components/ui/dialog'
import { getPriorityLabel, getStatusLabel, IncidentStatusEnum } from '@/features/incident/helpers/status-transition'
import { useFilesByEntity, useIncident } from '@/hooks/api'
import { useLanguage } from '@/i18n/LanguageContext'
import { formatDisplayDate } from '@/lib/date-utils'

interface IncidentDetailProps {
	incidentId: string | null
}

export function IncidentDetail({ incidentId }: Readonly<IncidentDetailProps>) {
	const navigate = useNavigate()

	const { t } = useLanguage()

	const { data: incident, isLoading } = useIncident(incidentId ?? '')
	const { data: attachments = [] } = useFilesByEntity('incident', incidentId ?? '')
	const uniqueAttachments = useMemo(() => {
		const seen = new Set<string>()
		return attachments.filter((attachment) => {
			const key = attachment.id || `${attachment.fileName || ''}-${attachment.fileUrl}`
			if (seen.has(key)) {
				return false
			}
			seen.add(key)
			return true
		})
	}, [attachments])

	if (!incidentId) return null

	const statusColors: Record<string, string> = {
		[IncidentStatusEnum.NEW]: 'var(--color-destructive)',
		[IncidentStatusEnum.IN_PROGRESS]: 'var(--color-warning)',
		[IncidentStatusEnum.IN_REVIEW]: 'var(--color-info)',
		[IncidentStatusEnum.CLOSE]: 'var(--color-success)',
		[IncidentStatusEnum.REOPEN]: 'var(--color-error)',
	}

	const getPriorityBadge = (prio: number) => {
		if (prio === 1)
			return (
				<span className="inline-flex items-center gap-1.25 px-2.75 py-1 rounded-5 text-[11px] font-extrabold bg-[#ef4444] text-white border-none">
					{getPriorityLabel(prio, t)}
				</span>
			)
		if (prio === 2)
			return (
				<span className="inline-flex items-center gap-1.25 px-2.75 py-1 rounded-5 text-[11px] font-extrabold bg-[#f59e0b] text-white border-none">
					{getPriorityLabel(prio, t)}
				</span>
			)
		return (
			<span className="inline-flex items-center gap-1.25 px-2.75 py-1 rounded-5 text-[11px] font-extrabold bg-card text-[#4b5563] border border-border">
				{getPriorityLabel(prio, t)}
			</span>
		)
	}

	const handleClose = () => {
		navigate({ to: '/incident' })
	}

	return (
		<Dialog open={true} onOpenChange={(open) => !open && handleClose()}>
			<DialogPortal>
				<DialogOverlay className="bg-black/30" />
				<DialogPrimitive.Content className="fixed inset-y-0 right-0 z-50 left-auto h-full w-105 translate-x-0 p-0 border-l border-border bg-card shadow-[-8px_0_32px_rgba(0,0,0,0.12)] overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right duration-250 outline-none flex flex-col">
					<div className="p-7 border-b border-border/50 flex flex-row items-center justify-between shrink-0">
						<div>
							<DialogPrimitive.Title className="text-[16px] font-extrabold text-foreground">
								{t('incidentDetails')}
							</DialogPrimitive.Title>
							<div className="text-[11px] font-bold mt-1 text-muted-foreground">
								{incident?.id.slice(0, 8).toUpperCase()}
							</div>
						</div>
						<Button
							variant="outline"
							size="icon"
							onClick={handleClose}
							className="w-7.5 h-7.5 rounded-1.75 border border-border bg-transparent flex items-center justify-center text-muted-foreground hover:bg-muted transition-all cursor-pointer outline-none"
						>
							<X className="w-3.5 h-3.5" />
						</Button>
					</div>

					<div className="flex-1 overflow-y-auto p-7">
						{isLoading && (
							<div className="flex flex-col items-center justify-center py-20 gap-4">
								<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
								<p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{t('loading')}</p>
							</div>
						)}

						{incident && (
							<div className="space-y-4.5">
								<section>
									<h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.5px] mb-2.5">
										{t('incidentInfo') ?? 'Thong tin su co'}
									</h3>

									<div className="space-y-0">
										<div className="flex justify-between items-center py-2 border-b border-border/50">
											<span className="text-[12px] text-muted-foreground font-medium">{t('elevatorCode')}</span>
											<span className="text-[12px] font-bold text-foreground">{incident.elevator.code}</span>
										</div>

										<div className="flex justify-between items-center py-2 border-b border-border/50">
											<span className="text-[12px] text-muted-foreground font-medium">{t('priority')}</span>
											<span>{getPriorityBadge(incident.priority)}</span>
										</div>

										<div className="flex justify-between items-center py-2 border-b border-border/50">
											<span className="text-[12px] text-muted-foreground font-medium">{t('status')}</span>
											<span className="text-[12px] font-bold" style={{ color: statusColors[incident.status] }}>
												{getStatusLabel(incident.status, t)}
											</span>
										</div>

										<div className="flex justify-between items-center py-2 border-b border-border/50">
											<span className="text-[12px] text-muted-foreground font-medium">{t('reportedBy')}</span>
											<span className="text-[12px] font-bold text-foreground">
												{incident?.reportedUser?.fullName || '-'}
											</span>
										</div>

										<div className="flex justify-between items-center py-2 border-b border-border/50">
											<span className="text-[12px] text-muted-foreground font-medium">{t('reportedDate')}</span>
											<span className="text-[12px] font-bold text-foreground">
												{formatDisplayDate(incident.createdAt)}
											</span>
										</div>

										<div className="flex justify-between items-center py-2">
											<span className="text-[12px] text-muted-foreground font-medium">{t('lastUpdated')}</span>
											<span className="text-[12px] font-bold text-foreground">
												{formatDisplayDate(incident.updatedAt)}
											</span>
										</div>
									</div>
								</section>

								<section>
									<h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.5px] mb-2.5">
										{t('description')}
									</h3>
									<div className="bg-muted px-3 py-3 rounded-2.25 text-[13px] text-foreground leading-[1.6] font-medium">
										{incident.description || t('noDescription')}
									</div>
								</section>

								<section>
									<h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.5px] mb-2.5">
										{t('attachedFiles')}
									</h3>
									{uniqueAttachments.length === 0 ? (
										<div className="bg-muted px-3 py-3 rounded-2.25 text-[13px] text-muted-foreground font-medium">
											{t('noFiles')}
										</div>
									) : (
										<div className="space-y-2">
											{uniqueAttachments.map((attachment) => (
												<a
													key={attachment.id}
													href={attachment.fileUrl}
													target="_blank"
													rel="noreferrer"
													className="block rounded-2.25 border border-border bg-muted/20 px-3 py-2 text-[13px] font-semibold text-foreground hover:border-primary hover:text-primary transition-colors"
												>
													{attachment.fileName || attachment.fileUrl}
												</a>
											))}
										</div>
									)}
								</section>
							</div>
						)}
					</div>
				</DialogPrimitive.Content>
			</DialogPortal>
		</Dialog>
	)
}
