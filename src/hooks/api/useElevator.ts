import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { elevatorApi } from '@/api/elevator.api'
import { translate } from '@/i18n/LanguageContext'
import type { Elevator, ElevatorCreate, ElevatorUpdate } from '@/types/api'

export const elevatorKeys = {
	all: ['elevators'] as const,
	lists: () => [...elevatorKeys.all, 'list'] as const,
	list: () => [...elevatorKeys.lists()] as const,
	details: () => [...elevatorKeys.all, 'detail'] as const,
	detail: (id: string) => [...elevatorKeys.details(), id] as const,
}

export const useElevators = () => {
	return useQuery<Elevator[], Error>({
		queryKey: elevatorKeys.list(),
		queryFn: elevatorApi.getElevators,
	})
}

export const useElevator = (elevatorId: string) => {
	return useQuery<Elevator, Error>({
		queryKey: elevatorKeys.detail(elevatorId),
		queryFn: () => elevatorApi.getElevator(elevatorId),
		enabled: !!elevatorId,
	})
}

export const useCreateElevator = () => {
	const queryClient = useQueryClient()

	return useMutation<Elevator, Error, ElevatorCreate>({
		mutationFn: elevatorApi.createElevator,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: elevatorKeys.lists() })
			toast.success(translate('elevatorCreatedSuccessfully'))
		},
		onError: () => {
			toast.error(translate('failedToCreateElevator'))
		},
	})
}

export const useUpdateElevator = () => {
	const queryClient = useQueryClient()

	return useMutation<Elevator, Error, { elevatorId: string; data: ElevatorUpdate }>({
		mutationFn: ({ elevatorId, data }) => elevatorApi.updateElevator(elevatorId, data),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: elevatorKeys.lists() })
			queryClient.invalidateQueries({
				queryKey: elevatorKeys.detail(variables.elevatorId),
			})
			toast.success(translate('elevatorUpdatedSuccessfully'))
		},
		onError: () => {
			toast.error(translate('failedToUpdateElevator'))
		},
	})
}

export const useDeleteElevator = () => {
	const queryClient = useQueryClient()

	return useMutation<void, Error, string>({
		mutationFn: elevatorApi.deleteElevator,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: elevatorKeys.lists() })
			toast.success(translate('elevatorDeletedSuccessfully'))
		},
		onError: () => {
			toast.error(translate('failedToDeleteElevator'))
		},
	})
}
