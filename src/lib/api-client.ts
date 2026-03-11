import type { HTTPValidationError } from '@/types/api'
import { keysToCamel, keysToSnake } from './case-converter'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export class ApiError extends Error {
	status: number
	data?: HTTPValidationError

	constructor(message: string, status: number, data?: HTTPValidationError) {
		super(message)
		this.name = 'ApiError'
		this.status = status
		this.data = data
	}
}

export const getAuthToken = (): string | null => {
	return localStorage.getItem('access_token')
}

export const setAuthToken = (token: string): void => {
	localStorage.setItem('access_token', token)
}

export const removeAuthToken = (): void => {
	localStorage.removeItem('access_token')
	localStorage.removeItem('refresh_token')
}

export const setRefreshToken = (token: string): void => {
	localStorage.setItem('refresh_token', token)
}

export const getRefreshToken = (): string | null => {
	return localStorage.getItem('refresh_token')
}

interface FetchOptions extends RequestInit {
	requireAuth?: boolean
}

export async function apiFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
	const { requireAuth = true, headers = {}, body, ...restOptions } = options

	const url = `${API_BASE_URL}${endpoint}`

	const requestHeaders: Record<string, string> = {
		'Content-Type': 'application/json',
		...(headers as Record<string, string>),
	}

	if (requireAuth) {
		const token = getAuthToken()
		if (token) {
			requestHeaders['Authorization'] = `Bearer ${token}`
		}
	}

	// Convert request body from camelCase to snake_case
	let processedBody: BodyInit | undefined
	if (body) {
		if (requestHeaders['Content-Type'] === 'application/json') {
			try {
				const parsedBody = typeof body === 'string' ? JSON.parse(body) : body
				const snakeCaseBody = keysToSnake(parsedBody)
				processedBody = JSON.stringify(snakeCaseBody)
			} catch {
				// If parsing fails, use original body
				processedBody = body as BodyInit
			}
		} else {
			processedBody = body as BodyInit
		}
	}

	try {
		const response = await fetch(url, {
			...restOptions,
			body: processedBody,
			headers: requestHeaders,
		})

		if (response.status === 204 || response.headers.get('content-length') === '0') {
			return undefined as T
		}

		const data = await response.json()

		if (!response.ok) {
			throw new ApiError(data.detail || data.message || 'API request failed', response.status, data)
		}

		// Convert response data from snake_case to camelCase
		return keysToCamel<T>(data)
	} catch (error) {
		if (error instanceof ApiError) {
			throw error
		}
		throw new ApiError(error instanceof Error ? error.message : 'Network error', 0)
	}
}

export async function apiGet<T>(endpoint: string, requireAuth = true): Promise<T> {
	return apiFetch<T>(endpoint, { method: 'GET', requireAuth })
}

export async function apiPost<T>(endpoint: string, body?: unknown, requireAuth = true): Promise<T> {
	return apiFetch<T>(endpoint, {
		method: 'POST',
		body: body ? JSON.stringify(body) : undefined,
		requireAuth,
	})
}

export async function apiPut<T>(endpoint: string, body?: unknown, requireAuth = true): Promise<T> {
	return apiFetch<T>(endpoint, {
		method: 'PUT',
		body: body ? JSON.stringify(body) : undefined,
		requireAuth,
	})
}

export async function apiDelete<T>(endpoint: string, requireAuth = true): Promise<T> {
	return apiFetch<T>(endpoint, { method: 'DELETE', requireAuth })
}

export async function apiPostFormData<T>(
	endpoint: string,
	body: Record<string, string>,
	requireAuth = false,
): Promise<T> {
	const formData = new URLSearchParams()
	Object.entries(body).forEach(([key, value]) => {
		formData.append(key, value)
	})

	return apiFetch<T>(endpoint, {
		method: 'POST',
		body: formData,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		requireAuth,
	})
}
