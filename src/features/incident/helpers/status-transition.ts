import { AlertCircle, CircleCheckBig, ClipboardCheck, LoaderCircle, RotateCcw, type LucideIcon } from 'lucide-react'
import type { IncidentStatus } from '@/types/api'

export interface IncidentStatusStyle {
	Icon: LucideIcon
	iconBg: string
	iconColor: string
	pillBg: string
	pillText: string
	pillBorder: string
}

export const IncidentStatusEnum = {
	NEW: 'new',
	IN_PROGRESS: 'in_progress',
	IN_REVIEW: 'in_review',
	CLOSE: 'close',
	REOPEN: 'reopen',
} as const

export const INCIDENT_STATUS_STYLES: Record<IncidentStatus, IncidentStatusStyle> = {
	new: {
		Icon: AlertCircle,
		iconBg: 'bg-red-50',
		iconColor: 'text-red-500',
		pillBg: 'bg-red-50',
		pillText: 'text-red-700',
		pillBorder: 'border-red-200',
	},
	in_progress: {
		Icon: LoaderCircle,
		iconBg: 'bg-orange-50',
		iconColor: 'text-orange-500',
		pillBg: 'bg-orange-50',
		pillText: 'text-orange-700',
		pillBorder: 'border-orange-200',
	},
	in_review: {
		Icon: ClipboardCheck,
		iconBg: 'bg-blue-50',
		iconColor: 'text-blue-500',
		pillBg: 'bg-blue-50',
		pillText: 'text-blue-700',
		pillBorder: 'border-blue-200',
	},
	close: {
		Icon: CircleCheckBig,
		iconBg: 'bg-emerald-50',
		iconColor: 'text-emerald-500',
		pillBg: 'bg-emerald-50',
		pillText: 'text-emerald-700',
		pillBorder: 'border-emerald-200',
	},
	reopen: {
		Icon: RotateCcw,
		iconBg: 'bg-rose-50',
		iconColor: 'text-rose-600',
		pillBg: 'bg-rose-50',
		pillText: 'text-rose-700',
		pillBorder: 'border-rose-200',
	},
}

export function getNextIncidentStatuses(status: IncidentStatus): IncidentStatus[] {
	switch (status) {
		case IncidentStatusEnum.NEW:
			return [IncidentStatusEnum.NEW, IncidentStatusEnum.IN_PROGRESS]
		case IncidentStatusEnum.IN_PROGRESS:
			return [IncidentStatusEnum.IN_PROGRESS, IncidentStatusEnum.IN_REVIEW]
		case IncidentStatusEnum.IN_REVIEW:
			return [IncidentStatusEnum.IN_REVIEW, IncidentStatusEnum.CLOSE, IncidentStatusEnum.REOPEN]
		case IncidentStatusEnum.CLOSE:
			return [IncidentStatusEnum.CLOSE]
		case IncidentStatusEnum.REOPEN:
			return [IncidentStatusEnum.REOPEN, IncidentStatusEnum.IN_PROGRESS]
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
		case IncidentStatusEnum.IN_REVIEW:
			return t('incidentInReview')
		case IncidentStatusEnum.CLOSE:
			return t('incidentClosed')
		case IncidentStatusEnum.REOPEN:
			return t('incidentReopened')
	}
}

export const IncidentPriorityEnum = {
	HIGH: 1,
	MEDIUM: 2,
	LOW: 3,
} as const

export const getPriorityLabel = (priority: number, t: (key: string) => string) => {
	switch (priority) {
		case IncidentPriorityEnum.LOW:
			return t('low')
		case IncidentPriorityEnum.MEDIUM:
			return t('medium')
		case IncidentPriorityEnum.HIGH:
			return t('high')
	}
}

export const getIncidentPriorityBadgeVariant = (priority: number) => {
	switch (priority) {
		case IncidentPriorityEnum.LOW:
			return 'secondary'
		case IncidentPriorityEnum.MEDIUM:
			return 'warning'
		case IncidentPriorityEnum.HIGH:
			return 'destructive'
		default:
			return 'default'
	}
}
