import { Edit, Eye, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useLanguage } from '@/i18n/LanguageContext'
import { formatCurrency } from '@/lib/currency-utils'
import { formatDisplayDate } from '@/lib/date-utils'
import type { Contract } from '@/types/api'

interface ContractTableProps {
	contracts: Contract[]
	onView: (contractId: string) => void
	onEdit: (contract: Contract) => void
	onDelete: (contractId: string) => void
	onElevatorClick: (elevatorId: string) => void
	isDeleting?: boolean
}

export function ContractTable({
	contracts,
	onView,
	onEdit,
	onDelete,
	onElevatorClick,
	isDeleting = false,
}: Readonly<ContractTableProps>) {
	const { t } = useLanguage()

	return (
		<Card className="rounded-2xl overflow-hidden border">
			<CardHeader className="p-4.5 px-5.5 pb-3.5 border-b border-border/50 bg-card">
				<CardTitle className="text-[15px] font-bold text-foreground">{t('allContracts')}</CardTitle>
				<CardDescription className="text-[12px] font-medium text-muted-foreground mt-0.5">
					{t('contractListDesc')}
				</CardDescription>
			</CardHeader>

			<CardContent className="p-0">
				{contracts.length === 0 ? (
					<div className="text-center py-12 text-muted-foreground">{t('noContractsFound')}</div>
				) : (
					<Table>
						<TableHeader>
							<TableRow className="bg-muted/50 hover:bg-muted/50">
								<TableHead className="py-2.5 px-4 text-[11px] font-bold text-muted-foreground tracking-[0.5px] uppercase whitespace-nowrap">
									{t('customer')}
								</TableHead>
								<TableHead className="py-2.5 px-4 text-[11px] font-bold text-muted-foreground tracking-[0.5px] uppercase whitespace-nowrap">
									{t('linkedElevators')}
								</TableHead>
								<TableHead className="py-2.5 px-4 text-[11px] font-bold text-muted-foreground tracking-[0.5px] uppercase whitespace-nowrap">
									{t('signDate')}
								</TableHead>
								<TableHead className="py-2.5 px-4 text-[11px] font-bold text-muted-foreground tracking-[0.5px] uppercase whitespace-nowrap">
									{t('expiryDate')}
								</TableHead>
								<TableHead className="py-2.5 px-4 text-[11px] font-bold text-muted-foreground tracking-[0.5px] uppercase whitespace-nowrap">
									{t('contractAmount')}
								</TableHead>
								<TableHead className="py-2.5 px-4 text-[11px] font-bold text-muted-foreground tracking-[0.5px] uppercase whitespace-nowrap">
									{t('priority')}
								</TableHead>
								<TableHead className="py-2.5 px-4 text-[11px] font-bold text-muted-foreground tracking-[0.5px] uppercase whitespace-nowrap">
									{t('status')}
								</TableHead>
								<TableHead className="py-2.5 px-4 text-[11px] font-bold text-muted-foreground tracking-[0.5px] uppercase whitespace-nowrap text-right">
									{t('actions')}
								</TableHead>
							</TableRow>
						</TableHeader>

						<TableBody>
							{contracts.map((contract) => {
								const isActive = contract.status === 'active'

								return (
									<TableRow key={contract.id} className="hover:bg-[#fafafa] transition-colors duration-150">
										<TableCell className="font-bold text-[13px] text-foreground border-b border-border/50">
											{contract.customer.fullName}
										</TableCell>

										<TableCell className="border-b border-border/50">
											<div className="flex flex-wrap gap-1.5">
												{contract.elevators.map((elevator) => (
													<button
														key={elevator.id}
														type="button"
														className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-md cursor-pointer hover:bg-orange-100 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400"
														onClick={() => onElevatorClick(elevator.id)}
													>
														{elevator.code}
													</button>
												))}
											</div>
										</TableCell>

										<TableCell className="text-[12px] font-medium text-muted-foreground border-b border-border/50">
											{formatDisplayDate(contract.signedAt)}
										</TableCell>

										<TableCell className="text-[12px] font-medium text-muted-foreground border-b border-border/50">
											<span className={contract.status === 'active' ? '' : 'text-[#d97706] font-bold'}>
												{formatDisplayDate(contract.expiredAt)}
											</span>
										</TableCell>

										<TableCell className="text-[13px] font-extrabold text-[#059669] border-b border-border/50">
											{formatCurrency(contract.contractValue)}
										</TableCell>

										<TableCell className="border-b border-border/50 text-center">
											<span className="inline-flex items-center justify-center w-6.5 h-6.5 rounded-1.75 text-[12px] font-extrabold bg-background border text-foreground">
												{contract.priority}
											</span>
										</TableCell>

										<TableCell className="border-b border-border/50">
											<span
												className={`inline-flex items-center gap-1.25 px-3 py-1 rounded-5 text-[11px] font-extrabold whitespace-nowrap ${isActive ? 'bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0]' : 'bg-muted text-muted-foreground border'}`}
											>
												<span
													className={`w-1.75 h-1.75 rounded-full ${isActive ? 'bg-[#10b981]' : 'bg-muted-foreground'}`}
												></span>
												{t(isActive ? 'contractActive' : 'contractExpired')}
											</span>
										</TableCell>

										<TableCell className="border-b border-border/50">
											<div className="flex gap-1.5 justify-end">
												<Button
													variant="outline"
													size="icon"
													className="w-7.5 h-7.5 rounded-1.75 border bg-card flex items-center justify-center text-muted-foreground hover:bg-[#fff7ed] hover:text-orange-600 hover:border-orange-200 transition-all cursor-pointer"
													onClick={() => onView(contract.id)}
												>
													<Eye className="w-3.25 h-3.25" />
												</Button>
												<Button
													variant="outline"
													size="icon"
													className="w-7.5 h-7.5 rounded-1.75 border bg-card flex items-center justify-center text-muted-foreground hover:bg-[#eff6ff] hover:text-blue-600 hover:border-[#bfdbfe] transition-all cursor-pointer"
													onClick={() => onEdit(contract)}
												>
													<Edit className="w-3.25 h-3.25" />
												</Button>
												<Button
													variant="outline"
													size="icon"
													className="w-7.5 h-7.5 rounded-1.75 border bg-card flex items-center justify-center text-muted-foreground hover:bg-[#fef2f2] hover:text-[#ef4444] hover:border-[#fecaca] transition-all cursor-pointer"
													onClick={() => onDelete(contract.id)}
													disabled={isDeleting}
												>
													<Trash2 className="w-3.25 h-3.25" />
												</Button>
											</div>
										</TableCell>
									</TableRow>
								)
							})}
						</TableBody>
					</Table>
				)}
			</CardContent>
		</Card>
	)
}
