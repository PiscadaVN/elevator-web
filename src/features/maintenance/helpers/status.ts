import {
	CalendarCheck,
	CalendarX,
	CheckCircle2,
	ClipboardCheck,
	Clock,
	LoaderCircle,
	type LucideIcon,
	XCircle,
} from 'lucide-react'

import type { MaintenanceStatus } from '@/types/api'

export interface MaintenanceStatusStyle {
	Icon: LucideIcon
	iconBg: string
	iconColor: string
	pillBg: string
	pillText: string
	pillBorder: string
}

export const MAINTENANCE_STATUS_STYLES: Record<MaintenanceStatus, MaintenanceStatusStyle> = {
	scheduled: {
		Icon: CalendarCheck,
		iconBg: 'bg-blue-50',
		iconColor: 'text-blue-500',
		pillBg: 'bg-blue-50',
		pillText: 'text-blue-700',
		pillBorder: 'border-blue-200',
	},
	upcoming: {
		Icon: Clock,
		iconBg: 'bg-amber-50',
		iconColor: 'text-amber-500',
		pillBg: 'bg-amber-50',
		pillText: 'text-amber-700',
		pillBorder: 'border-amber-200',
	},
	overdue: {
		Icon: CalendarX,
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
	under_review: {
		Icon: ClipboardCheck,
		iconBg: 'bg-violet-50',
		iconColor: 'text-violet-500',
		pillBg: 'bg-violet-50',
		pillText: 'text-violet-700',
		pillBorder: 'border-violet-200',
	},
	completed: {
		Icon: CheckCircle2,
		iconBg: 'bg-emerald-50',
		iconColor: 'text-emerald-500',
		pillBg: 'bg-emerald-50',
		pillText: 'text-emerald-700',
		pillBorder: 'border-emerald-200',
	},
	failed: {
		Icon: XCircle,
		iconBg: 'bg-rose-50',
		iconColor: 'text-rose-600',
		pillBg: 'bg-rose-50',
		pillText: 'text-rose-700',
		pillBorder: 'border-rose-200',
	},
}

export const MaintenanceStatusEnum = {
	SCHEDULED: 'scheduled',
	UPCOMING: 'upcoming',
	OVERDUE: 'overdue',
	IN_PROGRESS: 'in_progress',
	UNDER_REVIEW: 'under_review',
	COMPLETED: 'completed',
	FAILED: 'failed',
} as const

export const getMaintenanceStatusLabel = (status: MaintenanceStatus, t: (key: string) => string): string => {
	switch (status) {
		case MaintenanceStatusEnum.SCHEDULED:
			return t('maintenanceScheduled')
		case MaintenanceStatusEnum.UPCOMING:
			return t('maintenanceUpcoming')
		case MaintenanceStatusEnum.OVERDUE:
			return t('maintenanceOverdue')
		case MaintenanceStatusEnum.IN_PROGRESS:
			return t('maintenanceInProgress')
		case MaintenanceStatusEnum.UNDER_REVIEW:
			return t('maintenanceUnderReview')
		case MaintenanceStatusEnum.COMPLETED:
			return t('maintenanceCompleted')
		case MaintenanceStatusEnum.FAILED:
			return t('maintenanceFailed')
	}
}

export const getNextMaintenanceStatuses = (status: MaintenanceStatus): MaintenanceStatus[] => {
	switch (status) {
		case MaintenanceStatusEnum.SCHEDULED:
			return [MaintenanceStatusEnum.SCHEDULED, MaintenanceStatusEnum.IN_PROGRESS]
		case MaintenanceStatusEnum.UPCOMING:
			return [MaintenanceStatusEnum.UPCOMING, MaintenanceStatusEnum.IN_PROGRESS]
		case MaintenanceStatusEnum.OVERDUE:
			return [MaintenanceStatusEnum.OVERDUE, MaintenanceStatusEnum.IN_PROGRESS]
		case MaintenanceStatusEnum.IN_PROGRESS:
			return [MaintenanceStatusEnum.IN_PROGRESS, MaintenanceStatusEnum.UNDER_REVIEW]
		case MaintenanceStatusEnum.UNDER_REVIEW:
			return [MaintenanceStatusEnum.UNDER_REVIEW, MaintenanceStatusEnum.COMPLETED, MaintenanceStatusEnum.FAILED]
		case MaintenanceStatusEnum.COMPLETED:
			return [MaintenanceStatusEnum.COMPLETED]
		case MaintenanceStatusEnum.FAILED:
			return [MaintenanceStatusEnum.FAILED, MaintenanceStatusEnum.IN_PROGRESS]
	}
}

export function canTransitionMaintenanceStatus(
	currentStatus: MaintenanceStatus,
	nextStatus: MaintenanceStatus,
): boolean {
	if (currentStatus === nextStatus) {
		return true
	}

	return getNextMaintenanceStatuses(currentStatus).includes(nextStatus)
}
