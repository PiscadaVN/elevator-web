import { Edit, Eye, Trash2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
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
	onElevatorClick: () => void
	isDeleting?: boolean
}

export function ContractTable({
	contracts,
	onView,
	onEdit,
	onDelete,
	onElevatorClick,
	isDeleting = false,
}: ContractTableProps) {
	const { t } = useLanguage()

	return (
		<Card>
			<CardHeader>
				<CardTitle>{t('allContracts')}</CardTitle>
				<CardDescription>{t('contractListDesc')}</CardDescription>
			</CardHeader>
			<CardContent>
				{contracts.length === 0 ? (
					<div className="text-center py-12 text-muted-foreground">{t('noContractsFound')}</div>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>{t('customer')}</TableHead>
								<TableHead>{t('linkedElevators')}</TableHead>
								<TableHead>{t('signDate')}</TableHead>
								<TableHead>{t('expiryDate')}</TableHead>
								<TableHead>{t('amount')}</TableHead>
								<TableHead>{t('status')}</TableHead>
								<TableHead className="text-right">{t('actions')}</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{contracts.map((contract) => (
								<TableRow key={contract.id}>
									<TableCell>
										<div className="font-medium">{contract.customer.fullName}</div>
									</TableCell>
									<TableCell>
										<div className="flex flex-wrap gap-1">
											{contract.elevators.map((elevator) => (
												<Badge
													key={elevator.id}
													variant="outline"
													className="cursor-pointer hover:bg-primary/10 transition-colors"
													onClick={onElevatorClick}
												>
													{elevator.code}
												</Badge>
											))}
										</div>
									</TableCell>
									<TableCell>{formatDisplayDate(contract.signedAt)}</TableCell>
									<TableCell>{formatDisplayDate(contract.expiredAt)}</TableCell>
									<TableCell className="font-semibold">{formatCurrency(contract.contractValue)}</TableCell>
									<TableCell>
										<Badge variant={contract.isActive ? 'success' : 'destructive'}>
											{t(contract.isActive ? 'active' : 'expired')}
										</Badge>
									</TableCell>
									<TableCell className="text-right space-x-1">
										<Button variant="ghost" size="icon" onClick={() => onView(contract.id)}>
											<Eye className="w-4 h-4 text-primary" />
										</Button>
										<Button variant="ghost" size="icon" onClick={() => onEdit(contract)}>
											<Edit className="w-4 h-4 text-blue-600" />
										</Button>
										<Button variant="ghost" size="icon" onClick={() => onDelete(contract.id)} disabled={isDeleting}>
											<Trash2 className="w-4 h-4 text-red-600" />
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}
			</CardContent>
		</Card>
	)
}
