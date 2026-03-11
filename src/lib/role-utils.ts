export const UserRoles = {
	ADMIN: 'admin',
	OPERATOR: 'operator',
	USER: 'user',
} as const

export const isAdmin = (role?: string | null): boolean => role === UserRoles.ADMIN
