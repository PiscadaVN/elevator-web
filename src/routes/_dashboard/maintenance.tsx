import { createFileRoute } from '@tanstack/react-router'

import { MaintenanceList } from '@/features/maintenance/components/MaintenanceList'

export const Route = createFileRoute('/_dashboard/maintenance')({
	component: MaintenanceList,
})
