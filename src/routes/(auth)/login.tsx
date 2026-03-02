import { createFileRoute } from '@tanstack/react-router'
import { Languages } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { LoginPage } from '@/pages/auth/LoginPage'
import { useLanguage } from '@/i18n/LanguageContext'

export const Route = createFileRoute('/(auth)/login')({
	component: RouteComponent,
})

function RouteComponent() {
	const { language, setLanguage } = useLanguage()

	return (
		<div className="min-h-screen bg-slate-50/50 relative">
			<div className="absolute top-4 right-4 z-50">
				<Button
					variant="outline"
					size="sm"
					onClick={() => setLanguage(language === 'en' ? 'vi' : 'en')}
					className="rounded-full bg-white shadow-sm"
				>
					<Languages className="w-4 h-4 mr-2" />
					{language === 'en' ? 'Tiếng Việt' : 'English'}
				</Button>
			</div>
			<LoginPage />
		</div>
	)
}
