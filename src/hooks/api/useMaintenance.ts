import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { maintenanceApi } from '@/api/maintenance.api'
import { translate } from '@/i18n/LanguageContext'
import type { MaintenanceFormData, MaintenanceSchedule } from '@/types/api'

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

	return useMutation<MaintenanceSchedule, Error, MaintenanceFormData>({
		mutationFn: maintenanceApi.createMaintenanceSchedule,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: maintenanceKeys.lists() })
			toast.success(translate('maintenanceCreatedSuccessfully'))
		},
		onError: () => {
			toast.error(translate('failedToCreateMaintenance'))
		},
	})
}

export const useUpdateMaintenanceSchedule = () => {
	const queryClient = useQueryClient()

	return useMutation<MaintenanceSchedule, Error, { scheduleId: string; data: MaintenanceFormData }>({
		mutationFn: ({ scheduleId, data }) => maintenanceApi.updateMaintenanceSchedule(scheduleId, data),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: maintenanceKeys.lists() })
			queryClient.invalidateQueries({ queryKey: maintenanceKeys.detail(variables.scheduleId) })
			toast.success(translate('maintenanceUpdatedSuccessfully'))
		},
		onError: () => {
			toast.error(translate('failedToUpdateMaintenance'))
		},
	})
}

export const useDeleteMaintenanceSchedule = () => {
	const queryClient = useQueryClient()

	return useMutation<void, Error, string>({
		mutationFn: maintenanceApi.deleteMaintenanceSchedule,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: maintenanceKeys.lists() })
			toast.success(translate('maintenanceDeletedSuccessfully'))
		},
		onError: () => {
			toast.error(translate('failedToDeleteMaintenance'))
		},
	})
}
