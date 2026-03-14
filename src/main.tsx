import { RouterProvider } from '@tanstack/react-router'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { Toaster } from '@/components/ui/sonner'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { LanguageProvider } from '@/i18n/LanguageContext'
import { QueryProvider } from '@/providers/QueryProvider'

import './index.css'
import { router } from './router'

function InnerApp() {
	const { user } = useAuthStore()

	return <RouterProvider router={router} context={{ user }} />
}

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<QueryProvider>
			<LanguageProvider>
				<InnerApp />
				<Toaster position="top-right" richColors={true} />
			</LanguageProvider>
		</QueryProvider>
	</StrictMode>,
)
