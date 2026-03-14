import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { userApi } from '@/api/user.api'
import { translate } from '@/i18n/LanguageContext'
import { getAuthToken } from '@/lib/api-client'
import type { User, UserCreate, UserUpdate } from '@/types/api'

export const userKeys = {
	all: ['users'] as const,
	lists: () => [...userKeys.all, 'list'] as const,
	list: () => [...userKeys.lists()] as const,
	details: () => [...userKeys.all, 'detail'] as const,
	detail: (id: string) => [...userKeys.details(), id] as const,
	currentUser: ['currentUser'] as const,
}

export const useCurrentUser = () => {
	const hasToken = !!getAuthToken()

	return useQuery<User, Error>({
		queryKey: userKeys.currentUser,
		queryFn: userApi.getCurrentUser,
		enabled: hasToken,
		retry: false,
	})
}

export const useUsers = () => {
	return useQuery<User[], Error>({
		queryKey: userKeys.list(),
		queryFn: userApi.getUsers,
	})
}

export const useUser = (userId: string) => {
	return useQuery<User, Error>({
		queryKey: userKeys.detail(userId),
		queryFn: () => userApi.getUser(userId),
		enabled: !!userId,
	})
}

export const useCreateUser = () => {
	const queryClient = useQueryClient()

	return useMutation<User, Error, UserCreate>({
		mutationFn: userApi.createUser,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: userKeys.lists() })
			toast.success(translate('userCreatedSuccessfully'))
		},
		onError: () => {
			toast.error(translate('failedToCreateUser'))
		},
	})
}

export const useUpdateUser = () => {
	const queryClient = useQueryClient()

	return useMutation<User, Error, { userId: string; data: UserUpdate }>({
		mutationFn: ({ userId, data }) => userApi.updateUser(userId, data),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: userKeys.lists() })
			queryClient.invalidateQueries({
				queryKey: userKeys.detail(variables.userId),
			})
			toast.success(translate('userUpdatedSuccessfully'))
		},
		onError: () => {
			toast.error(translate('failedToUpdateUser'))
		},
	})
}

export const useDeleteUser = () => {
	const queryClient = useQueryClient()

	return useMutation<void, Error, string>({
		mutationFn: userApi.deleteUser,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: userKeys.lists() })
			toast.success(translate('userStatusUpdatedSuccessfully'))
		},
		onError: () => {
			toast.error(translate('failedToToggleUserStatus'))
		},
	})
}
