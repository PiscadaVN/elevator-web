export type ElevatorStatus = 'available' | 'maintenance' | 'out_of_order'

export interface Elevator {
	id: string
	name: string
	building: string
	floorRange: string
	status: ElevatorStatus
	lastUpdated: string
	maintenanceDate: string
	assignedUserId: string | null
	// New fields for BRD v1.0.1
	maintenanceCycle?: '1m' | '2m' | '3m' | '6m' | '12m'
	startDate?: string
	lastMaintenanceDate?: string
}

export type UserRole = 'super_admin' | 'admin' | 'operator' | 'viewer'

export interface User {
	id: string
	name: string
	email: string
	phone: string
	password?: string
	role: UserRole
	status: 'active' | 'disabled'
}

export type IncidentPriority = 'low' | 'medium' | 'high'
export type IncidentStatus = 'new' | 'in_progress' | 'resolved' | 'closed'

export interface Incident {
	id: string
	elevatorId: string
	description: string
	priority: IncidentPriority
	status: IncidentStatus
	images?: string[]
	createdAt: string
	updatedAt: string
	reporterId: string
}
