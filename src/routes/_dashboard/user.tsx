import { createFileRoute, redirect } from '@tanstack/react-router'

import { UserManagement } from '@/features/user-management/components/UserManagement'

export const Route = createFileRoute('/_dashboard/user')({
	beforeLoad: ({ context }) => {
		const isAdmin = context.user?.role === 'admin' || context.user?.role === 'super_admin'

		if (!isAdmin) {
			throw redirect({ to: '/' })
		}
	},
	component: UserManagement,
})
