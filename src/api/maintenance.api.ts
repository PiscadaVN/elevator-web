import { apiDelete, apiGet, apiPost, apiPut } from '@/lib/api-client'
import type { MaintenanceSchedule, MaintenanceScheduleCreate, MaintenanceScheduleUpdate } from '@/types/api'

export const maintenanceApi = {
	getMaintenanceSchedules: async (): Promise<MaintenanceSchedule[]> => {
		return apiGet<MaintenanceSchedule[]>('maintenance-schedules')
	},

	createMaintenanceSchedule: async (data: MaintenanceScheduleCreate): Promise<MaintenanceSchedule> => {
		return apiPost<MaintenanceSchedule>('maintenance-schedules', data)
	},

	getMaintenanceSchedule: async (scheduleId: string): Promise<MaintenanceSchedule> => {
		return apiGet<MaintenanceSchedule>(`maintenance-schedules/${scheduleId}`)
	},

	updateMaintenanceSchedule: async (
		scheduleId: string,
		data: MaintenanceScheduleUpdate,
	): Promise<MaintenanceSchedule> => {
		return apiPut<MaintenanceSchedule>(`maintenance-schedules/${scheduleId}`, data)
	},

	deleteMaintenanceSchedule: async (scheduleId: string): Promise<void> => {
		return apiDelete<void>(`maintenance-schedules/${scheduleId}`)
	},
}
