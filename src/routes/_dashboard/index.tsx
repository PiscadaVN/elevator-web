import { createFileRoute } from '@tanstack/react-router'

import { ElevatorDashboard } from '@/features/elevator/components/ElevatorDashboard'

export const Route = createFileRoute('/_dashboard/')({
	component: ElevatorDashboard,
})
