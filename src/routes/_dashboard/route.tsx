import { createFileRoute, Outlet, redirect, useLocation, useNavigate } from '@tanstack/react-router'
import { AlertTriangle, ChevronDown, FileText, LayoutGrid, Lock, LogOut, Users, Wrench } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ChangePasswordDialog } from '@/features/auth/components/ChangePasswordDialog'
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

function getInitials(name: string) {
	return name
		.split(' ')
		.map((n) => n[0])
		.join('')
		.slice(0, 2)
		.toUpperCase()
}

function RouteComponent() {
	const navigate = useNavigate()
	const location = useLocation()
	const currentTab = location.pathname

	useCurrentUser()

	const { user, logout } = useAuth()
	const { t } = useLanguage()

	const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)
	const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

	if (!user) return null

	const handleNavigate = (path: string) => {
		navigate({ to: path })
	}

	const handleChangePassword = () => {
		setIsChangePasswordOpen(true)
		setIsUserMenuOpen(false)
	}

	const handleLogout = async () => {
		setIsUserMenuOpen(false)
		await logout()
	}

	return (
		<div className="min-h-screen bg-slate-50/50 flex flex-col">
			<nav className="bg-white border-b px-8 py-2 flex items-center justify-between sticky top-0 z-10 shadow-sm">
				<Button
					variant="ghost"
					className="flex items-center gap-2 shrink-0 cursor-pointer px-0"
					onClick={() => handleNavigate('/')}
				>
					<div className="w-8 h-8 rounded-lg bg-linear-to-br from-primary to-orange-600 flex items-center justify-center shrink-0">
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							className="text-white"
							strokeWidth="2.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<rect x="5" y="2" width="14" height="20" rx="2" />
							<path d="M9 10l3-3 3 3" />
							<path d="M9 14l3 3 3-3" />
						</svg>
					</div>
					<span className="text-sm font-extrabold text-gray-900">
						Lift<span className="text-primary">Care</span>
					</span>
				</Button>

				<div className="flex items-center gap-4 flex-1 justify-center">
					<Button
						variant={currentTab === '/incident' ? 'default' : 'ghost'}
						size="sm"
						onClick={() => handleNavigate('/incident')}
						className="rounded-lg hover:bg-orange-600"
					>
						<AlertTriangle className="w-4 h-4 mr-2" /> {t('incidents')}
					</Button>
					<Button
						variant={currentTab === '/maintenance' ? 'default' : 'ghost'}
						size="sm"
						onClick={() => handleNavigate('/maintenance')}
						className="rounded-lg hover:bg-orange-600"
					>
						<Wrench className="w-4 h-4 mr-2" /> {t('maintenance')}
					</Button>
					<Button
						variant={currentTab === '/elevator' ? 'default' : 'ghost'}
						size="sm"
						onClick={() => handleNavigate('/elevator')}
						className="rounded-lg hover:bg-orange-600"
					>
						<LayoutGrid className="w-4 h-4 mr-2" /> {t('elevator')}
					</Button>
					<Button
						variant={currentTab === '/user' ? 'default' : 'ghost'}
						size="sm"
						onClick={() => handleNavigate('/user')}
						className="rounded-lg hover:bg-orange-600"
					>
						<Users className="w-4 h-4 mr-2" /> {t('users')}
					</Button>
					<Button
						variant={currentTab === '/contract' ? 'default' : 'ghost'}
						size="sm"
						onClick={() => handleNavigate('/contract')}
						className="rounded-lg hover:bg-orange-600"
					>
						<FileText className="w-4 h-4 mr-2" /> {t('contracts')}
					</Button>
				</div>

				<div className="flex items-center gap-2">
					<Popover open={isUserMenuOpen} onOpenChange={setIsUserMenuOpen}>
						<PopoverTrigger asChild>
							<Button
								variant="ghost"
								size="sm"
								className="rounded-xl h-auto px-3 py-1.5 border border-gray-200 hover:bg-gray-50"
							>
								<div className="flex items-center gap-2">
									<div className="w-7 h-7 rounded-full bg-linear-to-br from-primary to-orange-600 flex items-center justify-center text-white text-xs font-extrabold shrink-0">
										{getInitials(user.fullName)}
									</div>
									<div className="text-left leading-none">
										<div className="text-sm font-bold text-gray-800">{user.fullName}</div>
										<div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mt-0.5">
											{user.role}
										</div>
									</div>
									<ChevronDown className="w-3.5 h-3.5 text-gray-400" />
								</div>
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-48" align="end">
							<div className="flex flex-col gap-2">
								<Button variant="ghost" size="sm" className="justify-start" onClick={handleChangePassword}>
									<Lock className="w-4 h-4 mr-2" />
									{t('changePassword')}
								</Button>
								<Button
									variant="ghost"
									size="sm"
									className="justify-start text-destructive hover:text-destructive"
									onClick={handleLogout}
								>
									<LogOut className="w-4 h-4 mr-2" />
									{t('logout')}
								</Button>
							</div>
						</PopoverContent>
					</Popover>
				</div>
			</nav>

			<main className="flex-1 overflow-auto">
				<Outlet />
			</main>

			<ChangePasswordDialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen} />
		</div>
	)
}
