import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { elevatorUserApi } from '@/api/elevator-user.api'
import { translate } from '@/i18n/LanguageContext'
import type { ElevatorUser, ElevatorUserCreate, ElevatorUserUpdate } from '@/types/api'

export const elevatorUserKeys = {
	all: ['elevatorUsers'] as const,
	lists: () => [...elevatorUserKeys.all, 'list'] as const,
	list: () => [...elevatorUserKeys.lists()] as const,
	details: () => [...elevatorUserKeys.all, 'detail'] as const,
	detail: (id: string) => [...elevatorUserKeys.details(), id] as const,
	byElevator: (elevatorId: string) => [...elevatorUserKeys.all, 'elevator', elevatorId] as const,
	byUser: (userId: string) => [...elevatorUserKeys.all, 'user', userId] as const,
}

export const useElevatorUsers = () => {
	return useQuery<ElevatorUser[], Error>({
		queryKey: elevatorUserKeys.list(),
		queryFn: elevatorUserApi.getElevatorUsers,
	})
}

export const useElevatorUser = (elevatorUserId: string) => {
	return useQuery<ElevatorUser, Error>({
		queryKey: elevatorUserKeys.detail(elevatorUserId),
		queryFn: () => elevatorUserApi.getElevatorUser(elevatorUserId),
		enabled: !!elevatorUserId,
	})
}

export const useUsersByElevator = (elevatorId: string) => {
	return useQuery<ElevatorUser[], Error>({
		queryKey: elevatorUserKeys.byElevator(elevatorId),
		queryFn: () => elevatorUserApi.getUsersByElevator(elevatorId),
		enabled: !!elevatorId,
	})
}

export const useElevatorsByUser = (userId: string) => {
	return useQuery<ElevatorUser[], Error>({
		queryKey: elevatorUserKeys.byUser(userId),
		queryFn: () => elevatorUserApi.getElevatorsByUser(userId),
		enabled: !!userId,
	})
}

export const useCreateElevatorUser = () => {
	const queryClient = useQueryClient()

	return useMutation<ElevatorUser, Error, ElevatorUserCreate>({
		mutationFn: elevatorUserApi.createElevatorUser,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: elevatorUserKeys.lists() })
			toast.success(translate('assignmentCreatedSuccessfully'))
		},
		onError: () => {
			toast.error(translate('failedToCreateAssignment'))
		},
	})
}

export const useUpdateElevatorUser = () => {
	const queryClient = useQueryClient()

	return useMutation<ElevatorUser, Error, { elevatorUserId: string; data: ElevatorUserUpdate }>({
		mutationFn: ({ elevatorUserId, data }) => elevatorUserApi.updateElevatorUser(elevatorUserId, data),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: elevatorUserKeys.lists() })
			queryClient.invalidateQueries({
				queryKey: elevatorUserKeys.detail(variables.elevatorUserId),
			})
			toast.success(translate('assignmentUpdatedSuccessfully'))
		},
		onError: () => {
			toast.error(translate('failedToUpdateAssignment'))
		},
	})
}

export const useDeleteElevatorUser = () => {
	const queryClient = useQueryClient()

	return useMutation<void, Error, string>({
		mutationFn: elevatorUserApi.deleteElevatorUser,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: elevatorUserKeys.lists() })
			toast.success(translate('assignmentDeletedSuccessfully'))
		},
		onError: () => {
			toast.error(translate('failedToDeleteAssignment'))
		},
	})
}
