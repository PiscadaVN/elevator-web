import { Edit, Trash2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getMaintenanceStatusLabel, MaintenanceStatusEnum } from '@/features/maintenance/helpers/status'
import { useLanguage } from '@/i18n/LanguageContext'
import { formatDisplayDate } from '@/lib/date-utils'
import type { MaintenanceSchedule } from '@/types/api'

interface MaintenanceTableProps {
	schedules: MaintenanceSchedule[]
	isLoading: boolean
	onEdit: (schedule: MaintenanceSchedule) => void
	onDelete: (id: string) => void
}

const getStatusVariant = (status: MaintenanceSchedule['status']): 'default' | 'secondary' | 'outline' => {
	switch (status) {
		case MaintenanceStatusEnum.COMPLETED:
			return 'default'
		case MaintenanceStatusEnum.CANCELLED:
			return 'secondary'
		case MaintenanceStatusEnum.IN_PROGRESS:
		case MaintenanceStatusEnum.SCHEDULED:
			return 'outline'
	}
}

export function MaintenanceTable({ schedules, isLoading, onEdit, onDelete }: MaintenanceTableProps) {
	const { t } = useLanguage()

	return (
		<Card>
			<CardHeader>
				<CardTitle>{t('maintenance')}</CardTitle>
				<CardDescription>{t('maintenanceListDesc')}</CardDescription>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<div className="text-center py-8 text-muted-foreground">{t('loadingMaintenanceSchedules')}</div>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>{t('elevator')}</TableHead>
								<TableHead>{t('contract')}</TableHead>
								<TableHead>{t('scheduledStartAt')}</TableHead>
								<TableHead>{t('scheduledEndAt')}</TableHead>
								<TableHead>{t('assignedOperator')}</TableHead>
								<TableHead>{t('status')}</TableHead>
								<TableHead>{t('note')}</TableHead>
								<TableHead className="text-right">{t('actions')}</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{schedules.length === 0 ? (
								<TableRow>
									<TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
										{t('noMaintenanceSchedulesFound')}
									</TableCell>
								</TableRow>
							) : (
								schedules.map((schedule) => (
									<TableRow key={schedule.id}>
										<TableCell className="font-bold">{schedule.elevator?.code ?? t('notAvailable')}</TableCell>
										<TableCell>{schedule.contractId}</TableCell>
										<TableCell>{formatDisplayDate(schedule.scheduledStartAt)}</TableCell>
										<TableCell>{formatDisplayDate(schedule.scheduledEndAt)}</TableCell>
										<TableCell>{schedule.assignedOperator?.fullName ?? t('unassigned')}</TableCell>
										<TableCell>
											<Badge variant={getStatusVariant(schedule.status)}>
												{getMaintenanceStatusLabel(schedule.status, t)}
											</Badge>
										</TableCell>
										<TableCell className="max-w-xs truncate">{schedule.notes || t('notAvailable')}</TableCell>
										<TableCell className="text-right">
											<div className="flex items-center justify-end gap-2">
												<Button variant="ghost" size="icon" onClick={() => onEdit(schedule)}>
													<Edit className="w-4 h-4 text-blue-600" />
												</Button>
												<Button variant="ghost" size="icon" onClick={() => onDelete(schedule.id)}>
													<Trash2 className="w-4 h-4 text-red-600" />
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				)}
			</CardContent>
		</Card>
	)
}
