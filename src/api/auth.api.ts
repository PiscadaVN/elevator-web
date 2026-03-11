import {
	apiPost,
	apiPostFormData,
	getAuthToken,
	getRefreshToken,
	removeAuthToken,
	setAuthToken,
	setRefreshToken,
} from '@/lib/api-client'
import type { LoginRequest, PasswordChangeRequest, RefreshTokenRequest, TokenResponse } from '@/types/api'

export const authApi = {
	login: async (data: LoginRequest): Promise<TokenResponse> => {
		const response = await apiPostFormData<TokenResponse>(
			'auth/login',
			{
				username: data.username,
				password: data.password,
			},
			false,
		)

		setAuthToken(response.accessToken)
		setRefreshToken(response.refreshToken)

		return response
	},

	refreshToken: async (): Promise<TokenResponse> => {
		const refresh_token = getRefreshToken()
		if (!refresh_token) {
			throw new Error('No refresh token available')
		}

		const response = await apiPost<TokenResponse>(
			'auth/refresh_token',
			{ refreshToken: refresh_token } as RefreshTokenRequest,
			false,
		)

		setAuthToken(response.accessToken)
		setRefreshToken(response.refreshToken)

		return response
	},

	logout: async (): Promise<void> => {
		await apiPost<void>('auth/logout', undefined, true)
		removeAuthToken()
	},

	changePassword: async (data: PasswordChangeRequest): Promise<void> => {
		return apiPost<void>('auth/password', data, true)
	},

	isAuthenticated: (): boolean => {
		return !!getAuthToken()
	},
}
