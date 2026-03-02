import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'

import { LanguageProvider } from '@/i18n/LanguageContext'
import { AuthProvider, useAuth } from '@/features/auth/hooks/useAuth'

import './index.css'
import { router } from './router'

function InnerApp() {
	const { user } = useAuth()
	return <RouterProvider router={router} context={{ user }} />
}

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<AuthProvider>
			<LanguageProvider>
				<InnerApp />
			</LanguageProvider>
		</AuthProvider>
	</StrictMode>,
)
