import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'

export type Language = 'vi' | 'en'

type Translations = {
	[key: string]: {
		[K in Language]: string
	}
}

export const translations: Translations = {
	// Common
	appName: {
		vi: 'Hệ thống Quản lý Thang máy',
		en: 'Elevator Management System',
	},
	monitoring: { vi: 'Giám sát', en: 'Monitoring' },
	users: { vi: 'Người dùng', en: 'Users' },
	logout: { vi: 'Đăng xuất', en: 'Logout' },
	save: { vi: 'Lưu', en: 'Save' },
	cancel: { vi: 'Hủy', en: 'Cancel' },
	confirm: { vi: 'Xác nhận', en: 'Confirm' },
	delete: { vi: 'Xóa', en: 'Delete' },
	edit: { vi: 'Sửa', en: 'Edit' },
	actions: { vi: 'Thao tác', en: 'Actions' },
	status: { vi: 'Trạng thái', en: 'Status' },
	incidents: { vi: 'Sự cố', en: 'Incidents' },
	priority: { vi: 'Độ ưu tiên', en: 'Priority' },
	description: { vi: 'Mô tả', en: 'Description' },
	createdAt: { vi: 'Ngày tạo', en: 'Created At' },
	resolved: { vi: 'Đã xử lý', en: 'Resolved' },
	closed: { vi: 'Đóng', en: 'Closed' },
	inProgress: { vi: 'Đang xử lý', en: 'In Progress' },
	pendingApproval: { vi: 'Đợi duyệt', en: 'Pending Approval' },
	completed: { vi: 'Hoàn thành', en: 'Completed' },
	rejected: { vi: 'Từ chối', en: 'Rejected' },
	new: { vi: 'Mới', en: 'New' },
	high: { vi: 'Cao', en: 'High' },
	medium: { vi: 'Trung bình', en: 'Medium' },
	low: { vi: 'Thấp', en: 'Low' },
	reportIncident: { vi: 'Báo cáo sự cố', en: 'Report Incident' },
	elevator: { vi: 'Thang máy', en: 'Elevator' },
	confirmDelete: {
		vi: 'Xác nhận xóa sự cố này?',
		en: 'Confirm delete this incident?',
	},
	close: { vi: 'Đóng', en: 'Close' },

	// Auth
	loginTitle: { vi: 'Đăng nhập', en: 'Login' },
	loginDesc: {
		vi: 'Nhập email hoặc số điện thoại để truy cập hệ thống.',
		en: 'Enter email or phone number to access the system.',
	},
	identifierLabel: {
		vi: 'Email hoặc Số điện thoại',
		en: 'Email or Phone Number',
	},
	passwordLabel: { vi: 'Mật khẩu', en: 'Password' },
	signInBtn: { vi: 'Đăng nhập', en: 'Sign In' },
	loginError: {
		vi: 'Thông tin đăng nhập không hợp lệ.',
		en: 'Invalid credentials.',
	},
	mockAccounts: {
		vi: 'Tài khoản mẫu (Mật khẩu: password)',
		en: 'Mock Accounts (Password: password)',
	},
	missingRequiredFields: { vi: 'Vui lòng điền đầy đủ thông tin.', en: 'Please fill in all required fields.' },
	missingPhone: { vi: 'Vui lòng nhập số điện thoại.', en: 'Please enter a phone number.' },
	missingEmail: { vi: 'Vui lòng nhập email.', en: 'Please enter an email.' },
	emailOrPhoneExists: { vi: 'Email hoặc Số điện thoại đã tồn tại.', en: 'Email or Phone number already exists.' },

	// Dashboard Stats
	totalUnits: { vi: 'Tổng số thiết bị', en: 'Total Units' },
	connectedSystems: { vi: 'Hệ thống đã kết nối', en: 'Connected systems' },
	available: { vi: 'Sẵn sàng', en: 'Available' },
	maintenance: { vi: 'Bảo trì', en: 'Maintenance' },
	outOfOrder: { vi: 'Hỏng', en: 'Out of Order' },
	requiresAttention: { vi: 'Cần chú ý', en: 'Requires attention' },
	scheduledChecks: { vi: 'Lịch kiểm tra', en: 'Scheduled checks' },
	operational: { vi: 'Đang hoạt động', en: 'Operational' },

	// Elevator Table
	elevatorOverview: {
		vi: 'Tổng quan trạng thái thang máy',
		en: 'Elevator Status Overview',
	},
	elevatorOverviewDesc: {
		vi: 'Danh sách chi tiết tất cả các thang máy và trạng thái vận hành.',
		en: 'Comprehensive list of units and their operational state.',
	},
	addElevator: { vi: 'Thêm thang máy', en: 'Add Elevator' },
	elevatorNamePlaceholder: { vi: 'vd: Thang máy 5', en: 'e.g. Elevator 5' },
	buildingPlaceholder: { vi: 'vd: Tòa nhà A', en: 'e.g. Tower A' },
	floorRangePlaceholder: { vi: 'vd: 1-40', en: 'e.g. 1-40' },
	building: { vi: 'Tòa nhà', en: 'Building' },
	elevatorCode: { vi: 'Mã thang máy', en: 'Elevator Code' },
	elevatorCodePlaceholder: { vi: 'VD: ELV-001', en: 'e.g. ELV-001' },
	minFloor: { vi: 'Tầng thấp nhất', en: 'Min Floor' },
	maxFloor: { vi: 'Tầng cao nhất', en: 'Max Floor' },
	operators: { vi: 'Nhân viên vận hành', en: 'Operators' },
	selectOperators: { vi: 'Chọn nhân viên vận hành', en: 'Select operators' },
	searchOperators: { vi: 'Tìm nhân viên vận hành...', en: 'Search operators...' },
	floors: { vi: 'Số tầng', en: 'Floors' },
	floorRange: { vi: 'Khoảng tầng', en: 'Floor Range' },
	elevatorName: { vi: 'Tên thang máy', en: 'Elevator Name' },
	addElevatorDesc: {
		vi: 'Nhập thông tin thang máy để thêm vào hệ thống.',
		en: 'Enter elevator details to add it to the system.',
	},
	lastUpdated: { vi: 'Cập nhật cuối', en: 'Last Updated' },
	assignedTo: { vi: 'Người phụ trách', en: 'Assigned To' },
	unassigned: { vi: 'Chưa phân công', en: 'Unassigned' },
	assignOperator: { vi: 'Phân công nhân viên', en: 'Assign Operator' },
	confirmAdd: { vi: 'Xác nhận thêm', en: 'Confirm Add' },
	startDate: { vi: 'Ngày bắt đầu', en: 'Start Date' },
	maintenanceCycle: { vi: 'Chu kỳ bảo trì', en: 'Maintenance Cycle' },
	updateCompletion: {
		vi: 'Cập nhật ngày hoàn thành',
		en: 'Update Completion Date',
	},
	months_1: { vi: '1 tháng', en: '1 month' },
	months_2: { vi: '2 tháng', en: '2 month' },
	months_3: { vi: '3 tháng', en: '3 month' },
	months_6: { vi: '6 tháng', en: '6 month' },
	months_12: { vi: '12 tháng', en: '12 month' },

	// Maintenance Status
	maintenanceDate: { vi: 'Ngày bảo trì', en: 'Maintenance Date' },
	maintenanceStatus: { vi: 'Trạng thái bảo trì', en: 'Maintenance Status' },
	overdue: { vi: 'Quá hạn', en: 'Overdue' },
	dueSoon: { vi: 'Sắp đến hạn', en: 'Due Soon' },
	normal: { vi: 'Bình thường', en: 'Normal' },

	// User Management
	userManagementTitle: { vi: 'Quản lý Người dùng', en: 'User Management' },
	userManagementDesc: {
		vi: 'Quản lý tài khoản nhân viên, vai trò và quyền truy cập.',
		en: 'Manage staff accounts, roles, and system access.',
	},
	addUser: { vi: 'Thêm người dùng', en: 'Add User' },
	registeredUsers: { vi: 'Người dùng đã đăng ký', en: 'Registered Users' },
	accountsInSystem: {
		vi: 'Tài khoản hiện có trong hệ thống',
		en: 'Accounts currently in the system.',
	},
	fullName: { vi: 'Họ và tên', en: 'Full Name' },
	contact: { vi: 'Liên hệ', en: 'Contact' },
	email: { vi: 'Email', en: 'Email' },
	phone: { vi: 'Số điện thoại', en: 'Phone' },
	role: { vi: 'Vai trò', en: 'Role' },
	superadmin: { vi: 'Quản trị viên cấp cao', en: 'Super Administrator' },
	admin: { vi: 'Quản trị viên', en: 'Administrator' },
	operator: { vi: 'Nhân viên vận hành', en: 'Operator' },
	user: { vi: 'Người dùng', en: 'User' },
	viewer: { vi: 'Người xem', en: 'Viewer' },
	active: { vi: 'Hoạt động', en: 'Active' },
	disabled: { vi: 'Vô hiệu', en: 'Disabled' },
	disableUser: { vi: 'Vô hiệu hóa người dùng', en: 'Disable User' },
	enableUser: { vi: 'Kích hoạt người dùng', en: 'Enable User' },
	allowViewOldContractHistory: {
		vi: 'Cho phép xem lịch sử hợp đồng cũ',
		en: 'Allow viewing old contract history',
	},
	confirmDeleteUser: {
		vi: 'Bạn có chắc chắn muốn xóa người dùng này?',
		en: 'Are you sure you want to delete this user?',
	},
	copyright: {
		vi: '© 2026 Hệ thống Quản lý Thang máy Piscada',
		en: '© 2026 Piscada Elevator Management System',
	},

	// Contracts
	contracts: { vi: 'Hợp đồng', en: 'Contracts' },
	contractManagementTitle: { vi: 'Quản lý Hợp đồng', en: 'Contract Management' },
	contractManagementDesc: {
		vi: 'Quản lý hợp đồng bảo trì thang máy, theo dõi trạng thái và thông tin chi tiết.',
		en: 'Manage elevator maintenance contracts, track status and details.',
	},
	addContract: { vi: 'Thêm hợp đồng', en: 'Add Contract' },
	contractList: { vi: 'Danh sách hợp đồng', en: 'Contract List' },
	contractListDesc: {
		vi: 'Tất cả hợp đồng hiện có trong hệ thống.',
		en: 'All contracts currently in the system.',
	},
	customer: { vi: 'Khách hàng', en: 'Customer' },
	signDate: { vi: 'Ngày ký', en: 'Sign Date' },
	expiryDate: { vi: 'Ngày hết hạn', en: 'Expiry Date' },
	amount: { vi: 'Số tiền', en: 'Amount' },
	serviceCycle: { vi: 'Gói dịch vụ', en: 'Service Cycle' },
	everyMonths: { vi: 'tháng/lần', en: 'months' },
	contractStatus: { vi: 'Trạng thái HĐ', en: 'Contract Status' },
	contractActive: { vi: 'Còn hiệu lực', en: 'Active' },
	contractExpired: { vi: 'Hết hạn', en: 'Expired' },
	contractCancelled: { vi: 'Đã hủy', en: 'Cancelled' },
	linkedElevators: { vi: 'Thang máy liên kết', en: 'Linked Elevators' },
	selectCustomer: { vi: 'Chọn khách hàng', en: 'Select Customer' },
	selectElevator: { vi: 'Chọn thang máy', en: 'Select Elevator' },
	noContractsFound: { vi: 'Không có hợp đồng nào.', en: 'No contracts found.' },
	accessDenied: {
		vi: 'Bạn không có quyền xem thông tin này.',
		en: 'You do not have permission to view this information.',
	},
	viewElevator: { vi: 'Xem thang máy', en: 'View Elevator' },
	note: { vi: 'Ghi chú', en: 'Note' },
	contractId: { vi: 'Mã HĐ', en: 'Contract ID' },
	myContracts: { vi: 'Hợp đồng của tôi', en: 'My Contracts' },
	allContracts: { vi: 'Tất cả hợp đồng', en: 'All Contracts' },

	// Loading & Error Messages
	loading: { vi: 'Đang tải...', en: 'Loading...' },
	loadingIncidents: { vi: 'Đang tải sự cố...', en: 'Loading incidents...' },
	loadingContracts: { vi: 'Đang tải hợp đồng...', en: 'Loading contracts...' },
	loadingElevators: { vi: 'Đang tải thang máy...', en: 'Loading elevators...' },
	creating: { vi: 'Đang tạo...', en: 'Creating...' },
	saving: { vi: 'Đang lưu...', en: 'Saving...' },
	deleting: { vi: 'Đang xóa...', en: 'Deleting...' },
	updating: { vi: 'Đang cập nhật...', en: 'Updating...' },

	// Error Messages
	failedToCreate: { vi: 'Tạo không thành công', en: 'Failed to create' },
	failedToUpdate: { vi: 'Cập nhật không thành công', en: 'Failed to update' },
	failedToDelete: { vi: 'Xóa không thành công', en: 'Failed to delete' },
	failedToCreateContract: { vi: 'Tạo hợp đồng không thành công', en: 'Failed to create contract' },
	failedToUpdateContract: { vi: 'Cập nhật hợp đồng không thành công', en: 'Failed to update contract' },
	failedToDeleteContract: { vi: 'Xóa hợp đồng không thành công', en: 'Failed to delete contract' },
	failedToCreateIncident: {
		vi: 'Tạo sự cố không thành công. Vui lòng thử lại.',
		en: 'Failed to create incident. Please try again.',
	},
	failedToUpdateIncident: {
		vi: 'Cập nhật sự cố không thành công. Vui lòng thử lại.',
		en: 'Failed to update incident. Please try again.',
	},
	failedToDeleteIncident: {
		vi: 'Xóa sự cố không thành công. Vui lòng thử lại.',
		en: 'Failed to delete incident. Please try again.',
	},
	failedToUpdateStatus: {
		vi: 'Cập nhật trạng thái không thành công. Vui lòng thử lại.',
		en: 'Failed to update status. Please try again.',
	},
	invalidIncidentStatusTransition: {
		vi: 'Không thể chuyển trạng thái theo quy tắc hiện tại hoặc bạn không có quyền.',
		en: 'Status transition is not allowed by workflow or your permission.',
	},
	failedToCreateUser: { vi: 'Tạo người dùng không thành công', en: 'Failed to create user' },
	failedToUpdateUser: { vi: 'Cập nhật người dùng không thành công', en: 'Failed to update user' },
	failedToDeleteUser: { vi: 'Xóa người dùng không thành công', en: 'Failed to delete user' },
	failedToCreateElevator: { vi: 'Tạo thang máy không thành công', en: 'Failed to create elevator' },
	failedToUpdateElevator: { vi: 'Cập nhật thang máy không thành công', en: 'Failed to update elevator' },
	failedToDeleteElevator: { vi: 'Xóa thang máy không thành công', en: 'Failed to delete elevator' },
	noIncidentsFound: { vi: 'Không có sự cố nào.', en: 'No incidents found.' },
	noUsersFound: { vi: 'Không có người dùng nào.', en: 'No users found.' },
	noElevatorsFound: { vi: 'Không có thang máy nào.', en: 'No elevators found.' },
	failedToToggleUserStatus: {
		vi: 'Thay đổi trạng thái người dùng không thành công. Vui lòng thử lại.',
		en: 'Failed to toggle user status. Please try again.',
	},
	loadingUsers: { vi: 'Đang tải người dùng...', en: 'Loading users...' },
	failedToLoadUsers: { vi: 'Không thể tải danh sách người dùng', en: 'Failed to load users' },
	failedToCompleteMaintenance: {
		vi: 'Hoàn thành bảo trì không thành công. Vui lòng thử lại.',
		en: 'Failed to complete maintenance. Please try again.',
	},
	failedToLoadIncidents: { vi: 'Không thể tải danh sách sự cố', en: 'Failed to load incidents' },
	selectElevatorPlaceholder: { vi: 'Chọn thang máy', en: 'Select Elevator' },
	confirmDeleteElevator: {
		vi: 'Bạn có chắc chắn muốn xóa thang máy này?',
		en: 'Are you sure you want to delete this elevator?',
	},
	confirmDeleteIncident: {
		vi: 'Bạn có chắc chắn muốn xóa sự cố này?',
		en: 'Are you sure you want to delete this incident?',
	},
	createIncidentDesc: { vi: 'Tạo báo cáo sự cố mới.', en: 'Create a new incident report.' },
	incidentListDesc: {
		vi: 'Xem xét và quản lý các sự cố thang máy được báo cáo.',
		en: 'Review and manage reported elevator issues.',
	},
	updateIncidentDesc: { vi: 'Cập nhật thông tin chi tiết sự cố.', en: 'Update incident details.' },
	describeProblemPlaceholder: { vi: 'Mô tả vấn đề', en: 'Describe the problem' },
}

interface LanguageContextType {
	language: Language
	setLanguage: (lang: Language) => void
	t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

function getInitialLanguage(): Language {
	const savedLang = localStorage.getItem('elevator_lang') as Language | null
	return savedLang ?? 'vi'
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
	const [language, setLanguage] = useState<Language>(getInitialLanguage)

	const handleSetLanguage = (lang: Language) => {
		setLanguage(lang)
		localStorage.setItem('elevator_lang', lang)
	}

	const t = useCallback(
		(key: string): string => {
			return translations[key]?.[language] || key
		},
		[language],
	)

	const value = useMemo(() => ({ language, setLanguage: handleSetLanguage, t }), [language, t])

	return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
	const context = useContext(LanguageContext)
	if (context === undefined) {
		throw new Error('useLanguage must be used within a LanguageProvider')
	}
	return context
}
