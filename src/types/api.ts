export interface LoginRequest {
	username: string
	password: string
	grantType?: string | null
	scope?: string
	clientId?: string | null
	clientSecret?: string | null
}

export interface TokenResponse {
	accessToken: string
	refreshToken: string
	tokenType: string
}

export interface RefreshTokenRequest {
	refreshToken: string
}

export interface PasswordChangeRequest {
	oldPassword: string
	newPassword: string
}

export type UserRole = 'admin' | 'operator' | 'user'

export interface UserCreate {
	id?: string | null
	fullName: string
	phone: string
	email: string
	password: string
	role?: UserRole | null
	isActive?: boolean | null
	canViewContractHistory?: boolean | null
	deletedAt?: number | null
}

export interface UserUpdate {
	id?: string | null
	fullName?: string | null
	phone?: string | null
	email?: string | null
	password?: string | null
	role: UserRole
	isActive?: boolean | null
	canViewContractHistory?: boolean | null
	deletedAt?: number | null
}

export interface User {
	id: string
	fullName: string
	phone: string
	email: string
	password?: string
	role: UserRole
	isActive: boolean
	canViewContractHistory?: boolean
	createdAt?: number
	updatedAt?: number
	deletedAt?: number | null
}

export type ElevatorStatus = 'active' | 'out_of_order'

export interface ElevatorCreate {
	id?: string | null
	code: string
	address: string
	minFloor: number
	maxFloor: number
	status?: ElevatorStatus | null
	operatorIds?: string[]
}

export interface ElevatorUpdate {
	id?: string | null
	code?: string | null
	address?: string | null
	minFloor?: number | null
	maxFloor?: number | null
	status?: ElevatorStatus | null
	operatorIds?: string[]
}

export interface Elevator {
	id: string
	code: string
	address?: string | null
	minFloor?: number | null
	maxFloor?: number | null
	status: ElevatorStatus
	operatorIds?: string[]
	name?: string | null
	createdAt?: number
	updatedAt?: number
}

export type RelationType = 'TECHNICIAN' | 'VIEWER'

export interface ElevatorUserCreate {
	id?: string | null
	elevatorId: string
	userId: string
	relationType: RelationType
}

export interface ElevatorUserUpdate {
	id?: string | null
	elevatorId?: string | null
	userId?: string | null
	relationType?: RelationType | null
}

export interface ElevatorUser {
	id: string
	elevatorId: string
	userId: string
	relationType: RelationType
	createdAt?: number
	updatedAt?: number
}

export interface ContractCreate {
	id?: string | null
	elevatorId: string
	customerId: string
	signedAt?: number | null
	expiredAt?: number | null
	contractValue?: number | string | null
	description?: string | null
	isActive?: boolean | null
}

export interface ContractUpdate {
	id?: string | null
	elevatorId?: string | null
	customerId?: string | null
	signedAt?: number | null
	expiredAt?: number | null
	contractValue?: number | string | null
	description?: string | null
	isActive?: boolean | null
}

export interface Contract {
	id: string
	elevatorId: string
	customerId: string
	signedAt?: number | null
	expiredAt?: number | null
	contractValue?: number | null
	description?: string | null
	isActive: boolean
	createdAt?: number
	updatedAt?: number
}

export type IncidentStatus = 'NEW' | 'IN_PROGRESS' | 'PENDING_APPROVAL' | 'COMPLETED' | 'REJECTED'

export interface IncidentCreate {
	id?: string | null
	title: string
	elevatorId: string
	description?: string | null
	reportedUser?: string | null
	assignedUser?: string | null
	priority?: number | null
	status?: IncidentStatus | null
}

export interface IncidentUpdate {
	id?: string | null
	title?: string | null
	elevatorId?: string | null
	description?: string | null
	reportedUser?: string | null
	assignedUser?: string | null
	priority?: number | null
	status?: IncidentStatus | null
}

export interface Incident {
	id: string
	title: string
	elevatorId: string
	elevatorName?: string | null
	description?: string | null
	reportedUser?: string | null
	assignedUser?: string | null
	priority?: number | null
	status: IncidentStatus
	createdAt?: number
	updatedAt?: number
}

export type EntityType = 'CONTRACT' | 'INCIDENT'

export interface FileCreate {
	id?: string | null
	entityType: EntityType
	entityId: string
	fileUrl: string
	fileName?: string | null
	fileType?: string | null
	uploadedUser?: string | null
}

export interface FileUpdate {
	id?: string | null
	entityType?: EntityType | null
	entityId?: string | null
	fileUrl?: string | null
	fileName?: string | null
	fileType?: string | null
	uploadedUser?: string | null
}

export interface File {
	id: string
	entityType: EntityType
	entityId: string
	fileUrl: string
	fileName?: string | null
	fileType?: string | null
	uploadedUser?: string | null
	createdAt?: number
	updatedAt?: number
}

export interface ValidationError {
	loc: (string | number)[]
	msg: string
	type: string
}

export interface HTTPValidationError {
	detail?: ValidationError[]
}

export interface ApiResponse<T = unknown> {
	data?: T
	error?: string
	detail?: ValidationError[]
}
