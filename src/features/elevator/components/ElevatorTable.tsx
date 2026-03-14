import { Edit, Eye, Trash2, User as UserIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useLanguage } from '@/i18n/LanguageContext'
import type { Elevator, ElevatorStatus } from '@/types/api'

interface ElevatorTableProps {
	elevators: Elevator[]
	isLoading: boolean
	onEdit: (elevator: Elevator) => void
	onView: (id: string) => void
	onDelete: (id: string) => void
	isDeleting: boolean
}

export function ElevatorTable({
	elevators,
	isLoading,
	onEdit,
	onView,
	onDelete,
	isDeleting,
}: Readonly<ElevatorTableProps>) {
	const { t } = useLanguage()

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

	return (
		<div className="bg-card border border-border rounded-2xl overflow-hidden">
			<div className="px-5.5 pt-4.5 pb-3.5 border-b border-border/50">
				<div className="text-[15px] font-bold text-foreground">{t('elevatorOverview')}</div>
				<div className="text-[12px] text-muted-foreground font-medium mt-0.5">{t('elevatorOverviewDesc')}</div>
			</div>
			<div className="overflow-x-auto min-h-100">
				{isLoading ? (
					<div className="text-center py-8 text-muted-foreground">{t('loadingElevators')}</div>
				) : (
					<table className="w-full border-collapse text-left">
						<thead>
							<tr className="bg-muted/30">
								<th className="px-4 py-2.5 text-[11px] font-bold text-muted-foreground uppercase tracking-[0.5px] border-b border-border whitespace-nowrap">
									{t('elevatorCode')}
								</th>
								<th className="px-4 py-2.5 text-[11px] font-bold text-muted-foreground uppercase tracking-[0.5px] border-b border-border whitespace-nowrap">
									{t('building')}
								</th>
								<th className="px-4 py-2.5 text-[11px] font-bold text-muted-foreground uppercase tracking-[0.5px] border-b border-border whitespace-nowrap">
									{t('floors')}
								</th>
								<th className="px-4 py-2.5 text-[11px] font-bold text-muted-foreground uppercase tracking-[0.5px] border-b border-border whitespace-nowrap">
									{t('operators')}
								</th>
								<th className="px-4 py-2.5 text-[11px] font-bold text-muted-foreground uppercase tracking-[0.5px] border-b border-border whitespace-nowrap">
									{t('status')}
								</th>
								<th className="px-4 py-2.5 text-[11px] font-bold text-muted-foreground uppercase tracking-[0.5px] border-b border-border whitespace-nowrap text-right">
									{t('actions')}
								</th>
							</tr>
						</thead>
						<tbody>
							{elevators.length ? (
								elevators.map((elevator) => (
									<tr
										key={elevator.id}
										className="group hover:bg-muted/10 transition-colors border-b border-border/50 last:border-0"
									>
										<td className="px-4 py-3.25 align-middle">
											<div className="text-[13px] font-extrabold text-foreground">{elevator.code}</div>
										</td>
										<td className="px-4 py-3.25 align-middle">
											<div className="text-[12px] font-medium text-muted-foreground max-w-55 truncate">
												{elevator.address}
											</div>
										</td>
										<td className="px-4 py-3.25 align-middle">
											<div className="text-[13px] font-bold text-foreground">
												{elevator.minFloor} - {elevator.maxFloor}
											</div>
										</td>
										<td className="px-4 py-3.25 align-middle">
											{elevator.operators?.length ? (
												<div className="flex flex-wrap gap-1.25">
													{elevator.operators.map((op) => (
														<span
															key={op.id}
															className="inline-flex items-center gap-1 text-[11px] font-bold text-muted-foreground bg-muted/30 border border-border px-2 py-0.75 rounded-5"
														>
															<UserIcon className="w-2.5 h-2.5 text-muted-foreground/70" /> {op.fullName}
														</span>
													))}
												</div>
											) : (
												<span className="text-[12px] text-muted-foreground italic">{t('noOperatorAssigned')}</span>
											)}
										</td>
										<td className="px-4 py-3.25 align-middle">{getStatusBadge(elevator.status)}</td>
										<td className="px-4 py-3.25 align-middle text-right w-[1%] whitespace-nowrap">
											<div className="flex items-center gap-1.5 justify-end">
												<Button
													variant="outline"
													size="icon"
													onClick={() => onView(elevator.id)}
													className="w-7.5 h-7.5 rounded-1.75 border border-border bg-card text-[#6b7280] flex items-center justify-center hover:bg-[#fff7ed] hover:border-[#fed7aa] hover:text-[#f97316] transition-all cursor-pointer outline-none"
													title={t('view')}
												>
													<Eye className="w-3.25 h-3.25" />
												</Button>
												<Button
													variant="outline"
													size="icon"
													onClick={() => onEdit(elevator)}
													className="w-7.5 h-7.5 rounded-1.75 border border-border bg-card text-[#6b7280] flex items-center justify-center hover:bg-[#eff6ff] hover:border-[#bfdbfe] hover:text-[#2563eb] transition-all cursor-pointer outline-none"
													title={t('edit')}
												>
													<Edit className="w-3.25 h-3.25" />
												</Button>
												<Button
													variant="outline"
													size="icon"
													onClick={() => onDelete(elevator.id)}
													className="w-7.5 h-7.5 rounded-1.75 border border-border bg-card text-[#6b7280] flex items-center justify-center hover:bg-[#fef2f2] hover:border-[#fecaca] hover:text-[#ef4444] transition-all cursor-pointer outline-none disabled:opacity-50"
													title={t('delete')}
													disabled={isDeleting}
												>
													<Trash2 className="w-3.25 h-3.25" />
												</Button>
											</div>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan={6} className="px-4 py-5.5 text-[13px] text-center text-muted-foreground">
										{t('noElevatorsFound')}
									</td>
								</tr>
							)}
						</tbody>
					</table>
				)}
			</div>
		</div>
	)
}
