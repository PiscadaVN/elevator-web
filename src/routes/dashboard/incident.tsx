import { createFileRoute } from '@tanstack/react-router'

import { IncidentList } from "@/features/incident/components/IncidentList";

export const Route = createFileRoute('/dashboard/incident')({
	component: IncidentList,
})
