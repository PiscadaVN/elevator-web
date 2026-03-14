import * as DialogPrimitive from '@radix-ui/react-dialog'
import { useNavigate } from '@tanstack/react-router'
import { Building2, Calendar, CreditCard, FileText, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogOverlay, DialogPortal } from '@/components/ui/dialog'
import { useContract } from '@/hooks/api'
import { useLanguage } from '@/i18n/LanguageContext'
import { formatCurrency } from '@/lib/currency-utils'
import { formatDisplayDate } from '@/lib/date-utils'

interface ViewContractDialogProps {
	contractId: string
}

export function ViewContractDialog({ contractId }: Readonly<ViewContractDialogProps>) {
	const navigate = useNavigate()
	const { t } = useLanguage()

	const { data: contract, isLoading } = useContract(contractId)

	const navigateToElevator = (elevatorId: string) => {
		navigate({ to: `/elevator/${elevatorId}` })
	}

	const isActive = contract?.status === 'active'

	const handleClose = () => navigate({ to: '/contract' })

	return (
		<Dialog open={true} onOpenChange={(open) => !open && handleClose()}>
			<DialogPortal>
				<DialogOverlay className="bg-black/30" />
				<DialogPrimitive.Content className="fixed right-0 top-0 z-50 h-full w-110 max-w-full bg-card shadow-[-8px_0_32px_rgba(0,0,0,0.12)] overflow-hidden data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right duration-250 transition-all outline-none flex flex-col border-l border-border">
					<div className="p-7 border-b border-border/50 flex flex-row items-center justify-between shrink-0">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
								<FileText className="w-5 h-5" />
							</div>
							<div>
								<DialogPrimitive.Title className="text-[16px] font-extrabold text-foreground">
									{t('contractDetails')}
								</DialogPrimitive.Title>
								<div className="text-[11px] font-bold mt-0.5 text-muted-foreground uppercase tracking-wider">
									{contract?.id.slice(0, 8).toUpperCase()}
								</div>
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

						{contract && (
							<div className="space-y-6">
								{/* Basic Info Group */}
								<section>
									<div className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.5px] mb-3 flex items-center gap-2">
										<FileText className="w-3 h-3" /> {t('contractInformation')}
									</div>
									<div className="space-y-px bg-border/20 rounded-xl border border-border/50 overflow-hidden shadow-sm">
										<div className="flex justify-between items-center px-4 py-3 bg-card">
											<span className="text-[12px] font-medium text-muted-foreground">{t('customer')}</span>
											<span className="text-[12px] font-bold text-foreground text-right">
												{contract.customer.fullName}
											</span>
										</div>
										<div className="flex justify-between items-center px-4 py-3 bg-card border-t border-border/30">
											<span className="text-[12px] font-medium text-muted-foreground flex items-center gap-1.5">
												<Calendar className="w-3.5 h-3.5 opacity-50" /> {t('signDate')}
											</span>
											<span className="text-[12px] font-bold text-foreground text-right">
												{formatDisplayDate(contract.signedAt)}
											</span>
										</div>
										<div className="flex justify-between items-center px-4 py-3 bg-card border-t border-border/30">
											<span className="text-[12px] font-medium text-muted-foreground flex items-center gap-1.5">
												<Calendar className="w-3.5 h-3.5 opacity-50" /> {t('expiryDate')}
											</span>
											<span
												className={`text-[12px] font-bold text-right ${isActive ? 'text-foreground' : 'text-[#d97706]'}`}
											>
												{formatDisplayDate(contract.expiredAt)}
											</span>
										</div>
										<div className="flex justify-between items-center px-4 py-3 bg-card border-t border-border/30">
											<span className="text-[12px] font-medium text-muted-foreground flex items-center gap-1.5">
												<CreditCard className="w-3.5 h-3.5 opacity-50" /> {t('contractAmount')}
											</span>
											<span className="text-[13px] font-black text-[#059669] text-right">
												{formatCurrency(contract.contractValue)}
											</span>
										</div>
										<div className="flex justify-between items-center px-4 py-3 bg-card border-t border-border/30">
											<span className="text-[12px] font-medium text-muted-foreground">{t('priority')}</span>
											<span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-muted text-[11px] font-black text-foreground">
												{contract.priority}
											</span>
										</div>
										<div className="flex justify-between items-center px-4 py-3 bg-card border-t border-border/30">
											<span className="text-[12px] font-medium text-muted-foreground">{t('status')}</span>
											<span className="text-right">
												<span
													className={`inline-flex items-center gap-1.25 px-3 py-1 rounded-5 text-[11px] font-extrabold whitespace-nowrap ${isActive ? 'bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0]' : 'bg-muted text-muted-foreground border'}`}
												>
													<span
														className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#10b981]' : 'bg-muted-foreground'}`}
													></span>
													{t(isActive ? 'contractActive' : 'contractExpired')}
												</span>
											</span>
										</div>
									</div>
								</section>

								{/* Note Section */}
								{contract.description && (
									<section>
										<div className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.5px] mb-3">
											{t('note')}
										</div>
										<div className="p-4 rounded-xl bg-orange-50/50 border border-orange-100/50">
											<p className="text-[13px] font-medium text-foreground leading-relaxed">{contract.description}</p>
										</div>
									</section>
								)}

								{/* Linked Elevators Group */}
								<section>
									<div className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.5px] mb-3 flex items-center gap-2">
										<Building2 className="w-3 h-3" /> {t('linkedElevators')} ({contract.elevators.length})
									</div>
									<div className="grid grid-cols-1 gap-2">
										{contract.elevators.map((elevator) => (
											<button
												key={elevator.id}
												type="button"
												className="group flex justify-between items-center p-3 rounded-xl bg-background border border-border/50 hover:border-primary/30 transition-all cursor-pointer hover:shadow-sm w-full text-left focus:outline-none focus:ring-2 focus:ring-primary"
												onClick={() => navigateToElevator(elevator.id)}
												onKeyDown={(e) => {
													if (e.key === 'Enter' || e.key === ' ') {
														e.preventDefault()
														navigateToElevator(elevator.id)
													}
												}}
												tabIndex={0}
												aria-label={t('viewElevator')}
											>
												<div className="flex items-center gap-3">
													<div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100">
														<Building2 className="w-4 h-4" />
													</div>
													<div className="flex flex-col">
														<span className="text-[13px] font-bold text-foreground group-hover:text-primary transition-colors">
															{elevator.code}
														</span>
														<span className="text-[11px] text-muted-foreground font-medium truncate max-w-50">
															{elevator.address}
														</span>
													</div>
												</div>
												<div className="w-7 h-7 rounded-full bg-muted/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
													<X className="w-3.5 h-3.5 rotate-45" />
												</div>
											</button>
										))}
									</div>
								</section>
							</div>
						)}
					</div>
				</DialogPrimitive.Content>
			</DialogPortal>
		</Dialog>
	)
}
