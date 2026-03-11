import { useNavigate } from '@tanstack/react-router'

import { Badge } from '@/components/ui/badge'
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
import { formatDisplayDate } from '@/lib/date-utils'

interface ElevatorDetailProps {
	elevatorId: string
}

export function ElevatorDetail({ elevatorId }: ElevatorDetailProps) {
	const navigate = useNavigate()
	const { t } = useLanguage()

	const { data: elevatorDetail, isLoading: loadingElevator } = useElevator(elevatorId)

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
								<div>{elevatorDetail?.status === 'broken' ? t('broken') : t('normal')}</div>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-1">
								<Label className="text-muted-foreground text-xs">{t('operators')}</Label>
								<div>
									{elevatorDetail?.operators?.map((op) => (
										<Badge key={op.id} variant="outline" className="mx-1">
											{op.fullName}
										</Badge>
									)) || '-'}
								</div>
							</div>
							<div className="space-y-1">
								<Label className="text-muted-foreground text-xs">{t('lastUpdated')}</Label>
								<div className="text-muted-foreground">{formatDisplayDate(elevatorDetail.updatedAt)}</div>
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
