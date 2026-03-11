import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'

import type { User } from '@/types/api'

export interface RouterContext {
	user: User | null
}

export const Route = createRootRouteWithContext<RouterContext>()({
	component: RootComponent,
})

function RootComponent() {
	return <Outlet />
}
