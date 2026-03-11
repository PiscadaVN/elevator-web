import { AlertCircle, ArrowBigRightDash, Check, CheckCircle2, Clock, Edit, Trash2, X, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
	getNextIncidentStatuses,
	getStatusLabel,
	IncidentStatusEnum,
} from '@/features/incident/helpers/status-transition'
import { useLanguage } from '@/i18n/LanguageContext'
import type { Incident, IncidentStatus } from '@/types/api'

interface IncidentTableProps {
	incidents: Incident[]
	isLoading: boolean
	onEdit: (incident: Incident) => void
	onDelete: (id: string) => void
	onUpdateStatus: (id: string, status: IncidentStatus) => void
}

const getStatusIcon = (status: IncidentStatus) => {
	switch (status) {
		case IncidentStatusEnum.NEW:
			return <AlertCircle className="w-4 h-4 text-blue-500" />
		case IncidentStatusEnum.IN_PROGRESS:
			return <Clock className="w-4 h-4 text-yellow-500" />
		case IncidentStatusEnum.PENDING_APPROVAL:
			return <Clock className="w-4 h-4 text-orange-500" />
		case IncidentStatusEnum.COMPLETED:
			return <CheckCircle2 className="w-4 h-4 text-green-500" />
		case IncidentStatusEnum.REJECTED:
			return <XCircle className="w-4 h-4 text-red-500" />
	}
}

export function IncidentTable({ incidents, isLoading, onEdit, onDelete, onUpdateStatus }: IncidentTableProps) {
	const { t } = useLanguage()

	const getNextStatusButton = (incident: Incident) => {
		const allowedNextStatuses = getNextIncidentStatuses(incident.status)

		if (allowedNextStatuses.length === 0) {
			return null
		}

		if (incident.status === IncidentStatusEnum.PENDING_APPROVAL) {
			return (
				<div className="flex items-center gap-1">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => onUpdateStatus(incident.id, IncidentStatusEnum.COMPLETED)}
						title={t('completed')}
					>
						<Check className="w-4 h-4 text-green-600" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						onClick={() => onUpdateStatus(incident.id, IncidentStatusEnum.REJECTED)}
						title={t('rejected')}
					>
						<X className="w-4 h-4 text-red-600" />
					</Button>
				</div>
			)
		}

		const nextStatus = allowedNextStatuses[0]
		return (
			<Button
				variant="ghost"
				size="icon"
				onClick={() => onUpdateStatus(incident.id, nextStatus)}
				title={getStatusLabel(nextStatus, t)}
			>
				<ArrowBigRightDash className="w-4 h-4 text-green-600" />
			</Button>
		)
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>{t('incidents')}</CardTitle>
				<CardDescription>{t('incidentListDesc')}</CardDescription>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<div className="text-center py-8 text-muted-foreground">{t('loadingIncidents')}</div>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>{t('elevator')}</TableHead>
								<TableHead>{t('description')}</TableHead>
								<TableHead>{t('priority')}</TableHead>
								<TableHead>{t('createdAt')}</TableHead>
								<TableHead>{t('status')}</TableHead>
								<TableHead className="text-right">{t('actions')}</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{incidents.length === 0 ? (
								<TableRow>
									<TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
										{t('noIncidentsReported')}
									</TableCell>
								</TableRow>
							) : (
								incidents.map((incident) => (
									<TableRow key={incident.id}>
										<TableCell className="font-bold">{incident.elevatorName}</TableCell>
										<TableCell className="max-w-xs truncate">{incident.description}</TableCell>
										<TableCell>{incident.priority}</TableCell>
										<TableCell className="text-xs text-muted-foreground">
											{incident?.createdAt ? new Date(incident.createdAt).toLocaleString() : '-'}
										</TableCell>
										<TableCell>
											<div className="flex items-center gap-2">
												{getStatusIcon(incident.status)}
												<span className="capitalize text-sm">{getStatusLabel(incident.status, t)}</span>
											</div>
										</TableCell>
										<TableCell className="text-right space-x-2">
											<div className="flex items-center justify-end gap-2">
												{getNextStatusButton({ ...incident })}

												<Button variant="ghost" size="icon" onClick={() => onEdit(incident)}>
													<Edit className="w-4 h-4 text-blue-600" />
												</Button>

												<Button variant="ghost" size="icon" onClick={() => onDelete(incident.id)}>
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
