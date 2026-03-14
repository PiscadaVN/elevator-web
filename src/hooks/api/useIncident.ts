import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { incidentApi } from '@/api/incident.api'
import { translate } from '@/i18n/LanguageContext'
import type { Incident, IncidentCreate, IncidentUpdate } from '@/types/api'

export const incidentKeys = {
	all: ['incidents'] as const,
	lists: () => [...incidentKeys.all, 'list'] as const,
	list: () => [...incidentKeys.lists()] as const,
	details: () => [...incidentKeys.all, 'detail'] as const,
	detail: (id: string) => [...incidentKeys.details(), id] as const,
	byElevator: (elevatorId: string) => [...incidentKeys.all, 'elevator', elevatorId] as const,
	byAssignedUser: (userId: string) => [...incidentKeys.all, 'assigned', userId] as const,
}

export const useIncidents = () => {
	return useQuery<Incident[], Error>({
		queryKey: incidentKeys.list(),
		queryFn: incidentApi.getIncidents,
	})
}

export const useIncident = (incidentId: string) => {
	return useQuery<Incident, Error>({
		queryKey: incidentKeys.detail(incidentId),
		queryFn: () => incidentApi.getIncident(incidentId),
		enabled: !!incidentId,
	})
}

export const useIncidentsByElevator = (elevatorId: string) => {
	return useQuery<Incident[], Error>({
		queryKey: incidentKeys.byElevator(elevatorId),
		queryFn: () => incidentApi.getIncidentsByElevator(elevatorId),
		enabled: !!elevatorId,
	})
}

export const useIncidentsByAssignedUser = (userId: string) => {
	return useQuery<Incident[], Error>({
		queryKey: incidentKeys.byAssignedUser(userId),
		queryFn: () => incidentApi.getIncidentsByAssignedUser(userId),
		enabled: !!userId,
	})
}

export const useCreateIncident = () => {
	const queryClient = useQueryClient()

	return useMutation<Incident, Error, IncidentCreate>({
		mutationFn: incidentApi.createIncident,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: incidentKeys.lists() })
			toast.success(translate('incidentCreatedSuccessfully'))
		},
		onError: () => {
			toast.error(translate('failedToCreateIncident'))
		},
	})
}

export const useUpdateIncident = () => {
	const queryClient = useQueryClient()

	return useMutation<Incident, Error, { incidentId: string; data: IncidentUpdate }>({
		mutationFn: ({ incidentId, data }) => incidentApi.updateIncident(incidentId, data),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: incidentKeys.lists() })
			queryClient.invalidateQueries({
				queryKey: incidentKeys.detail(variables.incidentId),
			})
			toast.success(translate('incidentUpdatedSuccessfully'))
		},
		onError: () => {
			toast.error(translate('failedToUpdateIncident'))
		},
	})
}

export const useDeleteIncident = () => {
	const queryClient = useQueryClient()

	return useMutation<void, Error, string>({
		mutationFn: incidentApi.deleteIncident,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: incidentKeys.lists() })
			toast.success(translate('incidentDeletedSuccessfully'))
		},
		onError: () => {
			toast.error(translate('failedToDeleteIncident'))
		},
	})
}
