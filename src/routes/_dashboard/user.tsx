import { createFileRoute } from '@tanstack/react-router'

import { UserManagement } from '@/features/user-management/components/UserManagement'

export const Route = createFileRoute('/_dashboard/user')({
	component: UserManagement,
})
