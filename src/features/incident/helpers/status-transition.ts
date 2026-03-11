import type { IncidentStatus } from '@/types'

export const IncidentStatusEnum = {
	NEW: 'NEW',
	IN_PROGRESS: 'IN_PROGRESS',
	PENDING_APPROVAL: 'PENDING_APPROVAL',
	COMPLETED: 'COMPLETED',
	REJECTED: 'REJECTED',
} as const

export function getNextIncidentStatuses(status: IncidentStatus): IncidentStatus[] {
	switch (status) {
		case IncidentStatusEnum.NEW:
			return [IncidentStatusEnum.IN_PROGRESS]
		case IncidentStatusEnum.IN_PROGRESS:
			return [IncidentStatusEnum.PENDING_APPROVAL]
		case IncidentStatusEnum.PENDING_APPROVAL:
			return [IncidentStatusEnum.COMPLETED, IncidentStatusEnum.REJECTED]
		case IncidentStatusEnum.COMPLETED:
		case IncidentStatusEnum.REJECTED:
			return []
	}
}

export function canTransitionIncidentStatus(currentStatus: IncidentStatus, nextStatus: IncidentStatus): boolean {
	if (currentStatus === nextStatus) {
		return true
	}

	return getNextIncidentStatuses(currentStatus).includes(nextStatus)
}

export const getStatusLabel = (status: IncidentStatus, t: (key: string) => string) => {
	switch (status) {
		case IncidentStatusEnum.NEW:
			return t('new')
		case IncidentStatusEnum.IN_PROGRESS:
			return t('inProgress')
		case IncidentStatusEnum.PENDING_APPROVAL:
			return t('pendingApproval')
		case IncidentStatusEnum.COMPLETED:
			return t('completed')
		case IncidentStatusEnum.REJECTED:
			return t('rejected')
	}
}
