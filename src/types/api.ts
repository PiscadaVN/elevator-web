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
	role: UserRole
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

export interface ElevatorOperator {
	id: string
	fullName: string
	phone: string
	email: string
	role: UserRole
}

export interface Elevator {
	id: string
	code: string
	address?: string | null
	minFloor?: number | null
	maxFloor?: number | null
	status: ElevatorStatus
	operatorIds?: string[]
	operators?: ElevatorOperator[]
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

export type ContractStatus = 'active' | 'expired'

export interface ContractCreate {
	id?: string | null
	elevatorIds: string[]
	customerId: string
	signedAt?: number | null
	expiredAt?: number | null
	contractValue?: number
	description?: string | null
	isActive?: boolean | null
}

export interface ContractUpdate {
	id?: string | null
	elevatorIds?: string[] | []
	customerId?: string | null
	signedAt?: number | null
	expiredAt?: number | null
	contractValue?: number
	description?: string | null
	isActive?: boolean | null
}

export interface UserContract {
	id: string
	fullName: string
	phone: string
	email: string
	role: UserRole
	isActive: boolean
}

export interface ElevatorContract {
	id: string
	code: string
	name?: string | null
	address?: string | null
	description?: string | null
	minFloor?: number | null
	maxFloor?: number | null
	status: ElevatorStatus
	installationAt?: number | null
	createdAt?: number
	updatedAt?: number
	operators: UserContract[]
}

export interface Contract {
	id: string
	elevators: ElevatorContract[]
	customer: UserContract
	signedAt?: number | null
	expiredAt?: number | null
	contractValue?: number | null
	description?: string | null
	status: ContractStatus
	priority?: number
	note?: string | null
	isActive: boolean
	createdAt?: number
	updatedAt?: number
}

export interface ContractFormData {
	customerId: string
	elevatorIds: string[]
	signedAt?: number
	expiredAt?: number
	contractValue?: number
	status: ContractStatus
	priority?: number
	note?: string
	description?: string
}

export type IncidentStatus = 'new' | 'in_progress' | 'in_review' | 'close' | 'reopen'

export interface IncidentCreate {
	id?: string | null
	title: string
	elevatorId: string
	description?: string | null
	reportedUser?: string | null
	assignedUser?: string | null
	priority?: number | null
	status?: IncidentStatus | null
	fileIds?: string[] | null
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

export interface UserIncident {
	id: string
	fullName: string
	phone: string
	email: string
	role: UserRole
	isActive: boolean
}

export interface ElevatorIncident {
	id: string
	code: string
	name?: string | null
	address?: string | null
	createdAt: number
	description?: string | null
	installationAt?: number | null
	maxFloor?: number | null
	minFloor?: number | null
	operators?: ElevatorOperator[]
	status: ElevatorStatus
	updatedAt?: number
}

export interface Incident {
	assignedUser: string | null
	assignedUserId: string | null
	createdAt: number
	description: string | null
	elevator: ElevatorIncident
	elevatorId: string
	id: string
	priority: number
	reportedUser: UserIncident | null
	reportedUserId: number
	status: IncidentStatus
	title: string
	updatedBy?: UserIncident | string | null
	updatedAt: number
}

export interface PendingAttachment {
	fileName: string
	fileType?: string | null
	fileUrl: string
}

export interface IncidentFormData {
	title: string
	elevatorId: string
	description: string
	priority: number
	status: IncidentStatus
	attachments: PendingAttachment[]
}

export type MaintenanceStatus =
	| 'scheduled'
	| 'upcoming'
	| 'overdue'
	| 'in_progress'
	| 'under_review'
	| 'completed'
	| 'failed'

export interface MaintenanceScheduleCreate {
	id?: string | null
	elevatorId: string
	contractId?: string | null
	scheduledStartAt: number
	scheduledEndAt: number
	assignedOperatorId?: string | null
	status?: MaintenanceStatus | null
	completedAt?: number | null
	notes?: string | null
}

export interface MaintenanceScheduleUpdate {
	id?: string | null
	elevatorId?: string | null
	contractId?: string | null
	scheduledStartAt?: number | null
	scheduledEndAt?: number | null
	assignedOperatorId?: string | null
	status?: MaintenanceStatus | null
	completedAt?: number | null
	notes?: string | null
}

export interface ContractBasic {
	id: string
	customerId?: string | null
	signedAt?: number | null
	expiredAt?: number | null
	contractValue?: number | null
	description?: string | null
	priority?: number | null
	isActive?: boolean | null
	createdAt?: number | null
	updatedAt?: number | null
}

export interface MaintenanceSchedule {
	id: string
	elevatorId: string
	contractId?: string
	scheduledStartAt: number
	scheduledEndAt: number
	assignedOperatorId?: string
	status: MaintenanceStatus
	completedAt?: number
	notes?: string
	createdAt?: number
	updatedAt?: number
	elevator?: Elevator
	contract?: ContractBasic
	assignedOperator?: User
}

export interface MaintenanceFormData {
	elevatorId: string
	scheduledStartAt?: number
	status: MaintenanceStatus
	completedAt?: number
	notes?: string
}

export type EntityType = 'contract' | 'incident'

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
