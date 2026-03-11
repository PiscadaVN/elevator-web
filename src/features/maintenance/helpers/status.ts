import type { MaintenanceStatus } from '@/types/api'

export const MaintenanceStatusEnum = {
	SCHEDULED: 'scheduled',
	IN_PROGRESS: 'in_progress',
	COMPLETED: 'completed',
	CANCELLED: 'cancelled',
} as const

export const getMaintenanceStatusLabel = (status: MaintenanceStatus, t: (key: string) => string): string => {
	switch (status) {
		case MaintenanceStatusEnum.SCHEDULED:
			return t('scheduled')
		case MaintenanceStatusEnum.IN_PROGRESS:
			return t('inProgress')
		case MaintenanceStatusEnum.COMPLETED:
			return t('completed')
		case MaintenanceStatusEnum.CANCELLED:
			return t('cancelled')
	}
}
