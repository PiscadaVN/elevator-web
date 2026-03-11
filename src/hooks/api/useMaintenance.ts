import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { maintenanceApi } from '@/api/maintenance.api'
import type { MaintenanceSchedule, MaintenanceScheduleCreate, MaintenanceScheduleUpdate } from '@/types/api'

export const maintenanceKeys = {
	all: ['maintenance-schedules'] as const,
	lists: () => [...maintenanceKeys.all, 'list'] as const,
	list: () => [...maintenanceKeys.lists()] as const,
	details: () => [...maintenanceKeys.all, 'detail'] as const,
	detail: (id: string) => [...maintenanceKeys.details(), id] as const,
}

export const useMaintenanceSchedules = () => {
	return useQuery<MaintenanceSchedule[], Error>({
		queryKey: maintenanceKeys.list(),
		queryFn: maintenanceApi.getMaintenanceSchedules,
	})
}

export const useMaintenanceSchedule = (scheduleId: string) => {
	return useQuery<MaintenanceSchedule, Error>({
		queryKey: maintenanceKeys.detail(scheduleId),
		queryFn: () => maintenanceApi.getMaintenanceSchedule(scheduleId),
		enabled: !!scheduleId,
	})
}

export const useCreateMaintenanceSchedule = () => {
	const queryClient = useQueryClient()

	return useMutation<MaintenanceSchedule, Error, MaintenanceScheduleCreate>({
		mutationFn: maintenanceApi.createMaintenanceSchedule,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: maintenanceKeys.lists() })
		},
	})
}

export const useUpdateMaintenanceSchedule = () => {
	const queryClient = useQueryClient()

	return useMutation<MaintenanceSchedule, Error, { scheduleId: string; data: MaintenanceScheduleUpdate }>({
		mutationFn: ({ scheduleId, data }) => maintenanceApi.updateMaintenanceSchedule(scheduleId, data),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: maintenanceKeys.lists() })
			queryClient.invalidateQueries({ queryKey: maintenanceKeys.detail(variables.scheduleId) })
		},
	})
}

export const useDeleteMaintenanceSchedule = () => {
	const queryClient = useQueryClient()

	return useMutation<void, Error, string>({
		mutationFn: maintenanceApi.deleteMaintenanceSchedule,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: maintenanceKeys.lists() })
		},
	})
}
