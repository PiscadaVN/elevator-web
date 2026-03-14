import * as DialogPrimitive from '@radix-ui/react-dialog'
import { useNavigate } from '@tanstack/react-router'
import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogOverlay, DialogPortal } from '@/components/ui/dialog'
import { useElevator } from '@/hooks/api'
import { useLanguage } from '@/i18n/LanguageContext'
import type { ElevatorStatus } from '@/types/api'

interface ElevatorDetailProps {
	elevatorId: string | null
}

export function ElevatorDetail({ elevatorId }: Readonly<ElevatorDetailProps>) {
	const navigate = useNavigate()

	const { t } = useLanguage()

	const { data: elevator, isLoading } = useElevator(elevatorId ?? '')

	if (!elevatorId) return null

	const getStatusBadge = (status: ElevatorStatus) => {
		if (status === 'out_of_order') {
			return (
				<span className="inline-flex items-center gap-1.25 px-3 py-1.25 rounded-5 text-[11px] font-extrabold whitespace-nowrap bg-[#fef2f2] text-[#dc2626] border border-[#fecaca]">
					<div className="w-1.75 h-1.75 rounded-full bg-[#ef4444]"></div>
					{t('outOfOrder')}
				</span>
			)
		}

		return (
			<span className="inline-flex items-center gap-1.25 px-3 py-1.25 rounded-5 text-[11px] font-extrabold whitespace-nowrap bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0]">
				<div className="w-1.75 h-1.75 rounded-full bg-[#10b981]"></div>
				{t('active')}
			</span>
		)
	}

	const handleClose = () => {
		navigate({ to: '/elevator' })
	}

	return (
		<Dialog open={true} onOpenChange={(open) => !open && handleClose()}>
			<DialogPortal>
				<DialogOverlay className="bg-black/30" />
				<DialogPrimitive.Content className="fixed inset-y-0 right-0 left-auto z-50 h-full w-110 translate-x-0 p-0 border-l border-border bg-card shadow-[-8px_0_32px_rgba(0,0,0,0.12)] overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right duration-250 outline-none flex flex-col">
					<div className="p-7 border-b border-border/50 flex flex-row items-center justify-between shrink-0">
						<div>
							<DialogPrimitive.Title className="text-[16px] font-extrabold text-foreground">
								{t('elevatorDetails')}
							</DialogPrimitive.Title>
							<div className="text-[11px] font-bold mt-1 text-muted-foreground">{elevator?.code}</div>
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

						{elevator && (
							<>
								<div className="mb-4.5">
									<div className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.5px] mb-3">
										{t('basicInfo')}
									</div>
									<div className="space-y-px bg-border/20 rounded-xl border border-border/50 overflow-hidden">
										<div className="flex justify-between items-center px-4 py-3 bg-card">
											<span className="text-[12px] text-muted-foreground font-medium">{t('elevatorCode')}</span>
											<span className="text-[12px] font-bold text-foreground">{elevator.code}</span>
										</div>
										<div className="flex justify-between items-center px-4 py-3 bg-card border-t border-border/30">
											<span className="text-[12px] text-muted-foreground font-medium">{t('building')}</span>
											<span className="text-[12px] font-bold text-foreground text-right max-w-55 whitespace-pre-wrap">
												{elevator.address || '-'}
											</span>
										</div>
										<div className="flex justify-between items-center px-4 py-3 bg-card border-t border-border/30">
											<span className="text-[12px] text-muted-foreground font-medium">{t('floors')}</span>
											<span className="text-[12px] font-bold text-foreground">
												{elevator.minFloor} – {elevator.maxFloor}
											</span>
										</div>
										<div className="flex justify-between items-center px-4 py-3 bg-card border-t border-border/30">
											<span className="text-[12px] text-muted-foreground font-medium">{t('status')}</span>
											<span className="text-[12px] font-bold text-foreground flex justify-end">
												{getStatusBadge(elevator.status)}
											</span>
										</div>
									</div>
								</div>

								<div>
									<div className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.5px] mb-3">
										{t('operators')} ({elevator.operators?.length || 0})
									</div>
									{elevator.operators && elevator.operators.length > 0 ? (
										<div className="space-y-2">
											{elevator.operators.map((op) => (
												<div
													key={op.id}
													className="flex items-center gap-3 p-3 rounded-xl bg-background border border-border/50"
												>
													<div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-black">
														{op.fullName
															.split(' ')
															.map((n) => n[0])
															.join('')
															.slice(0, 2)
															.toUpperCase()}
													</div>
													<div className="flex flex-col">
														<span className="text-[13px] font-bold text-foreground leading-tight">{op.fullName}</span>
														<span className="text-[11px] text-muted-foreground font-medium">{t('operator')}</span>
													</div>
												</div>
											))}
										</div>
									) : (
										<div className="p-4 text-center rounded-xl bg-muted/30 border border-dashed border-border/50">
											<p className="text-[12px] text-muted-foreground italic">{t('noOperatorAssigned')}</p>
										</div>
									)}
								</div>
							</>
						)}
					</div>
				</DialogPrimitive.Content>
			</DialogPortal>
		</Dialog>
	)
}
