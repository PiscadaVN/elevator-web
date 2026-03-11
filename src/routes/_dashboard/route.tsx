import { createFileRoute, Outlet, redirect, useLocation, useNavigate } from '@tanstack/react-router'
import { AlertCircle, Languages, LayoutDashboard, Newspaper, Users } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useCurrentUser } from '@/hooks/api/useUser'
import { useLanguage } from '@/i18n/LanguageContext'
import { getAuthToken } from '@/lib/api-client'

export const Route = createFileRoute('/_dashboard')({
	beforeLoad: () => {
		const token = getAuthToken()
		if (!token) {
			throw redirect({ to: '/login' })
		}
	},
	component: RouteComponent,
})

function RouteComponent() {
	const navigate = useNavigate()
	const location = useLocation()
	const currentTab = location.pathname

	useCurrentUser()

	const { user } = useAuth()
	const { language, setLanguage, t } = useLanguage()

	if (!user) return null

	const handleNavigate = (path: string) => {
		navigate({ to: path })
	}

	return (
		<div className="min-h-screen bg-slate-50/50 flex flex-col">
			<nav className="bg-white border-b px-8 py-2 flex items-center justify-between sticky top-0 z-10 shadow-sm">
				<button className="flex items-center gap-2 shrink-0 cursor-pointer" onClick={() => handleNavigate('/')}>
					<img src="/logo.svg" alt="Elevator CMS" className="h-8 w-auto" />
				</button>
				<div className="flex items-center gap-4 flex-1 justify-center">
					<Button
						variant={currentTab === '/incident' ? 'default' : 'ghost'}
						size="sm"
						onClick={() => handleNavigate('/incident')}
						className="rounded-full"
					>
						<AlertCircle className="w-4 h-4 mr-2" /> {t('incidents')}
					</Button>
					<Button
						variant={currentTab === '/elevator' ? 'default' : 'ghost'}
						size="sm"
						onClick={() => handleNavigate('/elevator')}
						className="rounded-full"
					>
						<LayoutDashboard className="w-4 h-4 mr-2" /> {t('elevator')}
					</Button>
					<Button
						variant={currentTab === '/user' ? 'default' : 'ghost'}
						size="sm"
						onClick={() => handleNavigate('/user')}
						className="rounded-full"
					>
						<Users className="w-4 h-4 mr-2" /> {t('users')}
					</Button>
					<Button
						variant={currentTab === '/contract' ? 'default' : 'ghost'}
						size="sm"
						onClick={() => handleNavigate('/contract')}
						className="rounded-full"
					>
						<Newspaper className="w-4 h-4 mr-2" /> {t('contracts')}
					</Button>
				</div>
				<div className="flex items-center gap-2">
					<Button
						variant="ghost"
						size="sm"
						onClick={() => setLanguage(language === 'en' ? 'vi' : 'en')}
						className="rounded-full h-8 px-3"
					>
						<Languages className="w-4 h-4 mr-2" />
						<span className="text-xs font-bold uppercase">{language}</span>
					</Button>
				</div>
			</nav>

			<main className="flex-1 overflow-auto">
				<Outlet />
			</main>
		</div>
	)
}
