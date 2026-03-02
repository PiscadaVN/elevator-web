import { createFileRoute, Outlet, redirect, useLocation, useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useLanguage } from '@/i18n/LanguageContext'
import { Button } from '@/components/ui/button'
import { AlertCircle, Languages, LayoutDashboard, Users } from 'lucide-react'

export const Route = createFileRoute('/_dashboard')({
	beforeLoad: ({ context }) => {
		if (!context.user) {
			throw redirect({ to: '/login' })
		}
	},
	component: RouteComponent,
})

function RouteComponent() {
	const navigate = useNavigate()
	const location = useLocation()
	const currentTab = location.pathname

	const { user } = useAuth()
	const { language, setLanguage, t } = useLanguage()

	if (!user) return null

	const isAdmin = user!.role === 'admin' || user!.role === 'super_admin'

	const handleNavigate = (path: string) => {
		navigate({ to: path })
	}

	return (
		<div className="min-h-screen bg-slate-50/50 flex flex-col">
			<nav className="bg-white border-b px-8 py-2 flex items-center justify-between sticky top-0 z-10 shadow-sm">
				<div className="flex items-center gap-4 flex-1 justify-center">
					<Button
						variant={currentTab === '/' ? 'default' : 'ghost'}
						size="sm"
						onClick={() => handleNavigate('/')}
						className="rounded-full"
					>
						<LayoutDashboard className="w-4 h-4 mr-2" /> {t('monitoring')}
					</Button>
					<Button
						variant={currentTab === '/incident' ? 'default' : 'ghost'}
						size="sm"
						onClick={() => handleNavigate('/incident')}
						className="rounded-full"
					>
						<AlertCircle className="w-4 h-4 mr-2" /> {t('incidents')}
					</Button>
					{isAdmin && (
						<Button
							variant={currentTab === '/user' ? 'default' : 'ghost'}
							size="sm"
							onClick={() => handleNavigate('/user')}
							className="rounded-full"
						>
							<Users className="w-4 h-4 mr-2" /> {t('users')}
						</Button>
					)}
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
