import { useState } from "react"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { LoginPage } from "@/pages/auth/LoginPage"
import { ElevatorDashboard } from "@/features/elevator/components/ElevatorDashboard"
import { UserManagement } from "@/features/user-management/components/UserManagement"
import { IncidentList } from "@/features/incident/components/IncidentList"
import { Button } from "@/components/ui/button"
import { AlertCircle, Languages, LayoutDashboard, Users } from "lucide-react"
import { LanguageProvider, useLanguage } from "@/i18n/LanguageContext"

function AppContent() {
	const {user, isLoading} = useAuth()
	const {language, setLanguage, t} = useLanguage()
	const [activeTab, setActiveTab] = useState<"elevators" | "users" | "incidents">("elevators")

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-slate-50">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
			</div>
		)
	}

	if (!user) {
		return (
			<div className="min-h-screen bg-slate-50/50 relative">
				<div className="absolute top-4 right-4 z-50">
					<Button
						variant="outline"
						size="sm"
						onClick={() => setLanguage(language === 'en' ? 'vi' : 'en')}
						className="rounded-full bg-white shadow-sm"
					>
						<Languages className="w-4 h-4 mr-2"/>
						{language === 'en' ? 'Tiếng Việt' : 'English'}
					</Button>
				</div>
				<LoginPage/>
			</div>
		)
	}

	const isAdmin = user.role === 'admin' || user.role === 'super_admin'

	return (
		<div className="min-h-screen bg-slate-50/50 flex flex-col">
			<nav className="bg-white border-b px-8 py-2 flex items-center justify-between sticky top-0 z-10 shadow-sm">
				<div className="flex items-center gap-4 flex-1 justify-center">
					<Button
						variant={activeTab === 'elevators' ? 'default' : 'ghost'}
						size="sm"
						onClick={() => setActiveTab('elevators')}
						className="rounded-full"
					>
						<LayoutDashboard className="w-4 h-4 mr-2"/> {t('monitoring')}
					</Button>
					<Button
						variant={activeTab === 'incidents' ? 'default' : 'ghost'}
						size="sm"
						onClick={() => setActiveTab('incidents')}
						className="rounded-full"
					>
						<AlertCircle className="w-4 h-4 mr-2"/> {t('incidents')}
					</Button>
					{isAdmin && (<Button
						variant={activeTab === 'users' ? 'default' : 'ghost'}
						size="sm"
						onClick={() => setActiveTab('users')}
						className="rounded-full"
					>
						<Users className="w-4 h-4 mr-2"/> {t('users')}
					</Button>)}
				</div>
				<div className="flex items-center gap-2">
					<Button
						variant="ghost"
						size="sm"
						onClick={() => setLanguage(language === 'en' ? 'vi' : 'en')}
						className="rounded-full h-8 px-3"
					>
						<Languages className="w-4 h-4 mr-2"/>
						<span className="text-xs font-bold uppercase">{language}</span>
					</Button>
				</div>
			</nav>

			<main className="flex-1 overflow-auto">
				{(() => {
					switch (activeTab) {
						case 'incidents':
							return <IncidentList/>
						case 'users':
							return <UserManagement/>
						default:
							return <ElevatorDashboard/>
					}
				})()}
			</main>
		</div>
	)
}

function App() {
	return (
		<LanguageProvider>
			<AppContent/>
		</LanguageProvider>
	)
}

export default App
