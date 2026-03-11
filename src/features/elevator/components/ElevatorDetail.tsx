import { useNavigate } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { useElevator } from '@/hooks/api/useElevator'
import { useLanguage } from '@/i18n/LanguageContext'

interface ElevatorDetailProps {
	elevatorId: string
}

export function ElevatorDetail({ elevatorId }: ElevatorDetailProps) {
	const navigate = useNavigate()
	const { t } = useLanguage()

	const { data: elevatorDetail, isLoading: loadingElevator } = useElevator(elevatorId)

	// const getMaintenanceStatus = (date: string) => {
	// 	const today = new Date()
	// 	today.setHours(0, 0, 0, 0)
	// 	const maintenanceDate = new Date(date)
	// 	maintenanceDate.setHours(0, 0, 0, 0)
	//
	// 	const diffTime = maintenanceDate.getTime() - today.getTime()
	// 	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
	//
	// 	if (diffDays < 0) return 'overdue'
	// 	if (diffDays <= 7) return 'due_soon'
	// 	return 'normal'
	// }

	// const getMaintenanceBadge = (date: string) => {
	// 	const status = getMaintenanceStatus(date)
	// 	switch (status) {
	// 		case 'overdue':
	// 			return <Badge variant="destructive">{t('overdue')}</Badge>
	// 		case 'due_soon':
	// 			return <Badge variant="warning">{t('dueSoon')}</Badge>
	// 		default:
	// 			return (
	// 				<Badge variant="outline" className="text-green-600 border-green-200">
	// 					{t('normal')}
	// 				</Badge>
	// 			)
	// 	}
	// }

	return (
		<Dialog open={true} onOpenChange={() => navigate({ to: '/elevator' })}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{t('elevator')}: {elevatorDetail?.code}
					</DialogTitle>
					<DialogDescription>{t('elevatorOverview')}</DialogDescription>
				</DialogHeader>

				{loadingElevator ? (
					<div className="grid gap-4 py-8">
						<div className="flex flex-col items-center justify-center">
							<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
							<p className="text-sm text-muted-foreground">{t('loadingElevators')}</p>
						</div>
					</div>
				) : !elevatorDetail ? (
					<div className="grid gap-4 py-8">
						<div className="text-center">
							<p className="text-sm text-muted-foreground">{t('elevatorNotFound')}</p>
						</div>
					</div>
				) : (
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-1">
								<Label className="text-muted-foreground text-xs">{t('elevatorCode')}</Label>
								<p className="font-bold">{elevatorDetail?.code}</p>
							</div>
							<div className="space-y-1">
								<Label className="text-muted-foreground text-xs">{t('building')}</Label>
								<p>{elevatorDetail?.address}</p>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-1">
								<Label className="text-muted-foreground text-xs">{t('floors')}</Label>
								<p>
									{elevatorDetail?.minFloor} - {elevatorDetail?.maxFloor}
								</p>
							</div>
							<div className="space-y-1">
								<Label className="text-muted-foreground text-xs">{t('status')}</Label>
								<div>{elevatorDetail?.status === 'out_of_order' ? t('outOfOrder') : t('normal')}</div>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-1">
								<Label className="text-muted-foreground text-xs">{t('operators')}</Label>
								<p>{(elevatorDetail?.operatorIds ?? []).join(', ') || '-'}</p>
							</div>
							<div className="space-y-1">
								<Label className="text-muted-foreground text-xs">{t('lastUpdated')}</Label>
								<p className="text-muted-foreground">{elevatorDetail?.updatedAt}</p>
							</div>
						</div>
					</div>
				)}
				<DialogFooter>
					<Button onClick={() => navigate({ to: '/elevator' })}>{t('close')}</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
