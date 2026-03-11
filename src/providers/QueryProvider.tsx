import React, { useState } from 'react'
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { useAuthStore } from '@/features/auth/store/auth.store'

export function QueryProvider({ children }: { children: React.ReactNode }) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				queryCache: new QueryCache({
					onSuccess: (data, query) => {
						if (query.queryKey[0] === 'currentUser' && data) {
							useAuthStore.setState({
								user: data,
								isLoading: false,
								isInitialized: true,
							})
						}
					},
					onError: (_error, query) => {
						if (query.queryKey[0] === 'currentUser') {
							useAuthStore.setState({
								user: null,
								isLoading: false,
								isInitialized: true,
							})
						}
					},
				}),
				defaultOptions: {
					queries: {
						staleTime: 60 * 1000,
						retry: 1,
						refetchOnWindowFocus: false,
					},
					mutations: {
						retry: 0,
					},
				},
			}),
	)

	return (
		<QueryClientProvider client={queryClient}>
			{children}
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	)
}
