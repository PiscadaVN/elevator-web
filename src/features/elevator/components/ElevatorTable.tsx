import { Edit, Eye, Trash2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useLanguage } from '@/i18n/LanguageContext'
import { formatDisplayDate } from '@/lib/date-utils'
import type { Elevator } from '@/types/api'

const getStatusBadge = (status: string, t: (key: string) => string) => {
	switch (status) {
		case 'broken':
			return (
				<Badge variant="destructive" className="ml-2">
					{t('outOfOrder')}
				</Badge>
			)
		default:
			return (
				<Badge variant="outline" className="ml-2 text-green-600 border-green-200">
					{t('normal')}
				</Badge>
			)
	}
}

interface ElevatorTableProps {
	elevators: Elevator[]
	isLoading: boolean
	onEdit: (elevator: Elevator) => void
	onView: (id: string) => void
	onDelete: (id: string) => void
	isDeleting: boolean
}

export function ElevatorTable({ elevators, isLoading, onEdit, onView, onDelete, isDeleting }: ElevatorTableProps) {
	const { t } = useLanguage()

	return (
		<Card>
			<CardHeader className="flex gap-1.5">
				<CardTitle>{t('elevatorOverview')}</CardTitle>
				<CardDescription>{t('elevatorOverviewDesc')}</CardDescription>
			</CardHeader>

			<CardContent>
				{isLoading ? (
					<div className="text-center py-8 text-muted-foreground">{t('loadingElevators')}</div>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="text-left">{t('elevatorCode')}</TableHead>
								<TableHead className="text-left">{t('building')}</TableHead>
								<TableHead className="text-center">{t('floors')}</TableHead>
								<TableHead className="text-center">{t('operators')}</TableHead>
								<TableHead className="text-center">{t('status')}</TableHead>
								<TableHead className="text-right">{t('lastUpdated')}</TableHead>
								<TableHead className="text-right">{t('actions')}</TableHead>
							</TableRow>
						</TableHeader>

						<TableBody>
							{elevators.map((elevator) => (
								<TableRow key={elevator.id}>
									<TableCell className="font-bold text-left">{elevator.code}</TableCell>
									<TableCell className="text-left">{elevator.address}</TableCell>
									<TableCell className="text-center">
										{elevator.minFloor} - {elevator.maxFloor}
									</TableCell>
									<TableCell className="text-center">
										{elevator.operators?.map((op) => (
											<Badge key={op.id} variant="outline" className="mx-1">
												{op.fullName}
											</Badge>
										)) || '-'}
									</TableCell>
									<TableCell className="text-center">{getStatusBadge(elevator.status, t)}</TableCell>
									<TableCell className="text-muted-foreground text-right">
										{formatDisplayDate(elevator.updatedAt)}
									</TableCell>

									<TableCell className="text-right space-x-2">
										<Button variant="ghost" size="icon" onClick={() => onEdit(elevator)}>
											<Edit className="w-4 h-4 text-blue-600" />
										</Button>

										<Button variant="ghost" size="icon" onClick={() => onView(elevator.id)}>
											<Eye className="w-4 h-4 text-primary" />
										</Button>

										<Button variant="ghost" size="icon" onClick={() => onDelete(elevator.id)} disabled={isDeleting}>
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
