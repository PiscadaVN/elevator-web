import { LoginForm } from '@/features/auth/components/LoginForm'

export function LoginPage() {
	return (
		<div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
			<LoginForm />
		</div>
	)
}
