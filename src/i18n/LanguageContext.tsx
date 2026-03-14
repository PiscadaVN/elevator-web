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
	permissions: { vi: 'Phân quyền', en: 'Permissions' },
	selectRole: { vi: 'Chọn vai trò', en: 'Select role' },
	searchCustomerPlaceholder: { vi: 'Tìm khách hàng...', en: 'Search customer...' },
	searchUserPlaceholder: { vi: 'Tìm tên, email...', en: 'Search name, email...' },
	allRoles: { vi: 'Tất cả vai trò', en: 'All roles' },
	status: { vi: 'Trạng thái', en: 'Status' },
	cancelled: { vi: 'Đã hủy', en: 'Cancelled' },
	maintenanceScheduled: { vi: 'Đã lên lịch', en: 'Scheduled' },
	maintenanceUpcoming: { vi: 'Sắp đến hạn', en: 'Upcoming' },
	maintenanceOverdue: { vi: 'Quá hạn', en: 'Overdue' },
	maintenanceInProgress: { vi: 'Đang bảo trì', en: 'In Progress' },
	maintenanceUnderReview: { vi: 'Đã bảo trì', en: 'Under Review' },
	maintenanceCompleted: { vi: 'Hoàn thành', en: 'Completed' },
	maintenanceFailed: { vi: 'Chưa đạt', en: 'Failed' },
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
	paginationShowing: { vi: 'Hiển thị', en: 'Showing' },
	paginationOf: { vi: 'trên', en: 'of' },
	paginationPrevious: { vi: 'Trước', en: 'Previous' },
	paginationNext: { vi: 'Sau', en: 'Next' },

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
	invalidPhoneFormat: { vi: 'Số điện thoại không đúng định dạng.', en: 'Invalid phone number format.' },
	invalidEmailFormat: { vi: 'Email không đúng định dạng.', en: 'Invalid email format.' },
	maxFloorMustBeGreaterThanOrEqualMinFloor: {
		vi: 'Tầng cao nhất không thể nhỏ hơn tầng thấp nhất.',
		en: 'Max floor cannot be less than min floor.',
	},
	emailExists: { vi: 'Email đã tồn tại.', en: 'Email already exists.' },

	// Dashboard Stats
	totalUnits: { vi: 'Tổng số thiết bị', en: 'Total Units' },
	connectedSystems: { vi: 'Hệ thống đã kết nối', en: 'Connected systems' },
	available: { vi: 'Sẵn sàng', en: 'Available' },
	maintenance: { vi: 'Bảo trì', en: 'Maintenance' },
	outOfOrder: { vi: 'Hỏng', en: 'Out of Order' },
	requiresAttention: { vi: 'Cần chú ý', en: 'Requires attention' },
	scheduledChecks: { vi: 'Lịch kiểm tra', en: 'Scheduled checks' },
	operational: { vi: 'Đang hoạt động', en: 'Operational' },
	totalElevators: { vi: 'Tổng thang máy', en: 'Total Elevators' },
	elevatorStatus_available: { vi: 'Hoạt động', en: 'Active' },
	elevatorStatus_out_of_order: { vi: 'Hỏng', en: 'Out of Order' },
	elevatorStatus_maintenance: { vi: 'Đang bảo trì', en: 'Maintenance' },

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
	searchElevatorPlaceholder: { vi: 'Tìm mã thang, tòa nhà...', en: 'Search code, building...' },
	elevatorDetails: { vi: 'Chi tiết thang máy', en: 'Elevator Details' },
	elevatorNotFound: { vi: 'Không tìm thấy thang máy.', en: 'Elevator not found.' },
	basicInfo: { vi: 'Thông tin cơ bản', en: 'Basic Information' },
	noOperatorAssigned: { vi: 'Chưa phân công', en: 'Not assigned' },
	view: { vi: 'Xem', en: 'View' },
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
	scheduledAt: { vi: 'Ngày bảo trì', en: 'Maintenance Date' },
	assignedOperator: { vi: 'Nhân viên được phân công', en: 'Assigned Operator' },
	overdue: { vi: 'Quá hạn', en: 'Overdue' },
	dueSoon: { vi: 'Sắp đến hạn', en: 'Due Soon' },
	normal: { vi: 'Bình thường', en: 'Normal' },
	broken: { vi: 'Hỏng', en: 'Broken' },
	invalidMaintenanceStatusTransition: {
		vi: 'Không thể chuyển trạng thái theo quy tắc hiện tại.',
		en: 'Status transition is not allowed by workflow.',
	},

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
	allUsers: { vi: 'Tất cả người dùng', en: 'All Users' },
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
	contract: { vi: 'Hợp đồng', en: 'Contract' },
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
	contractAmount: { vi: 'Giá trị hợp đồng', en: 'Contract Amount' },
	serviceCycle: { vi: 'Gói dịch vụ', en: 'Service Cycle' },
	everyMonths: { vi: 'tháng/lần', en: 'months' },
	contractStatus: { vi: 'Trạng thái HĐ', en: 'Contract Status' },
	contractActive: { vi: 'Hiệu lực', en: 'Active' },
	contractExpired: { vi: 'Hết hạn', en: 'Expired' },
	contractCancelled: { vi: 'Đã hủy', en: 'Cancelled' },
	linkedElevators: { vi: 'Thang máy liên kết', en: 'Linked Elevators' },
	expiryDateMustBeOnOrAfterSignDate: {
		vi: 'Ngày hết hạn không thể sớm hơn ngày ký.',
		en: 'Expiry date cannot be earlier than sign date.',
	},
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
	selectElevators: { vi: 'Chọn thang máy', en: 'Select Elevators' },
	searchElevators: { vi: 'Tìm thang máy...', en: 'Search elevators...' },
	noElevatorsFound: { vi: 'Không có thang máy nào.', en: 'No elevators found.' },

	// Maintenance
	maintenanceManagementTitle: { vi: 'Quản lý Bảo trì', en: 'Maintenance Management' },
	maintenanceManagementDesc: {
		vi: 'Quản lý lịch bảo trì thang máy, phân công và theo dõi trạng thái thực hiện.',
		en: 'Manage elevator maintenance schedules, assignments, and execution status.',
	},
	maintenanceListDesc: {
		vi: 'Danh sách lịch bảo trì trong hệ thống.',
		en: 'List of maintenance schedules in the system.',
	},
	addMaintenance: { vi: 'Thêm lịch bảo trì', en: 'Add Maintenance' },
	createMaintenanceDesc: { vi: 'Tạo lịch bảo trì mới.', en: 'Create a new maintenance schedule.' },
	updateMaintenanceDesc: { vi: 'Cập nhật thông tin lịch bảo trì.', en: 'Update maintenance schedule details.' },
	noMaintenanceSchedulesFound: { vi: 'Không có lịch bảo trì nào.', en: 'No maintenance schedules found.' },
	selectContractPlaceholder: { vi: 'Chọn hợp đồng', en: 'Select contract' },
	selectOperatorPlaceholder: { vi: 'Chọn nhân viên vận hành', en: 'Select operator' },
	maintenanceNotesPlaceholder: { vi: 'Ghi chú bảo trì', en: 'Maintenance notes' },
	searchMaintenancePlaceholder: { vi: 'Tìm thang máy, nhân viên...', en: 'Search elevator, staff...' },
	allStatuses: { vi: 'Tất cả trạng thái', en: 'All statuses' },
	notAvailable: { vi: 'Không có', en: 'N/A' },
	deleteMaintenance: { vi: 'Xóa lịch bảo trì', en: 'Delete Maintenance' },

	// Loading & Error Messages
	loading: { vi: 'Đang tải...', en: 'Loading...' },
	loadingIncidents: { vi: 'Đang tải sự cố...', en: 'Loading incidents...' },
	loadingContracts: { vi: 'Đang tải hợp đồng...', en: 'Loading contracts...' },
	loadingElevators: { vi: 'Đang tải thang máy...', en: 'Loading elevators...' },
	loadingMaintenanceSchedules: { vi: 'Đang tải lịch bảo trì...', en: 'Loading maintenance schedules...' },
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
	failedToCreateMaintenance: { vi: 'Tạo lịch bảo trì không thành công', en: 'Failed to create maintenance schedule' },
	failedToUpdateMaintenance: {
		vi: 'Cập nhật lịch bảo trì không thành công',
		en: 'Failed to update maintenance schedule',
	},
	failedToDeleteMaintenance: { vi: 'Xóa lịch bảo trì không thành công', en: 'Failed to delete maintenance schedule' },
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
	failedToToggleUserStatus: {
		vi: 'Thay đổi trạng thái người dùng không thành công. Vui lòng thử lại.',
		en: 'Failed to toggle user status. Please try again.',
	},
	failedToCreateAssignment: { vi: 'Tạo phân công không thành công', en: 'Failed to create assignment' },
	failedToUpdateAssignment: { vi: 'Cập nhật phân công không thành công', en: 'Failed to update assignment' },
	failedToDeleteAssignment: { vi: 'Xóa phân công không thành công', en: 'Failed to delete assignment' },
	failedToCreateFile: { vi: 'Tạo tệp không thành công', en: 'Failed to create file' },
	failedToUpdateFile: { vi: 'Cập nhật tệp không thành công', en: 'Failed to update file' },
	failedToDeleteFile: { vi: 'Xóa tệp không thành công', en: 'Failed to delete file' },
	contractCreatedSuccessfully: { vi: 'Tạo hợp đồng thành công', en: 'Contract created successfully' },
	contractUpdatedSuccessfully: { vi: 'Cập nhật hợp đồng thành công', en: 'Contract updated successfully' },
	contractDeletedSuccessfully: { vi: 'Xóa hợp đồng thành công', en: 'Contract deleted successfully' },
	elevatorCreatedSuccessfully: { vi: 'Tạo thang máy thành công', en: 'Elevator created successfully' },
	elevatorUpdatedSuccessfully: { vi: 'Cập nhật thang máy thành công', en: 'Elevator updated successfully' },
	elevatorDeletedSuccessfully: { vi: 'Xóa thang máy thành công', en: 'Elevator deleted successfully' },
	incidentCreatedSuccessfully: { vi: 'Tạo sự cố thành công', en: 'Incident created successfully' },
	incidentUpdatedSuccessfully: { vi: 'Cập nhật sự cố thành công', en: 'Incident updated successfully' },
	incidentDeletedSuccessfully: { vi: 'Xóa sự cố thành công', en: 'Incident deleted successfully' },
	maintenanceCreatedSuccessfully: {
		vi: 'Tạo lịch bảo trì thành công',
		en: 'Maintenance schedule created successfully',
	},
	maintenanceUpdatedSuccessfully: {
		vi: 'Cập nhật lịch bảo trì thành công',
		en: 'Maintenance schedule updated successfully',
	},
	maintenanceDeletedSuccessfully: {
		vi: 'Xóa lịch bảo trì thành công',
		en: 'Maintenance schedule deleted successfully',
	},
	userCreatedSuccessfully: { vi: 'Tạo người dùng thành công', en: 'User created successfully' },
	userUpdatedSuccessfully: { vi: 'Cập nhật người dùng thành công', en: 'User updated successfully' },
	userStatusUpdatedSuccessfully: {
		vi: 'Cập nhật trạng thái người dùng thành công',
		en: 'User status updated successfully',
	},
	assignmentCreatedSuccessfully: { vi: 'Tạo phân công thành công', en: 'Assignment created successfully' },
	assignmentUpdatedSuccessfully: { vi: 'Cập nhật phân công thành công', en: 'Assignment updated successfully' },
	assignmentDeletedSuccessfully: { vi: 'Xóa phân công thành công', en: 'Assignment deleted successfully' },
	fileCreatedSuccessfully: { vi: 'Tạo tệp thành công', en: 'File created successfully' },
	fileUpdatedSuccessfully: { vi: 'Cập nhật tệp thành công', en: 'File updated successfully' },
	fileDeletedSuccessfully: { vi: 'Xóa tệp thành công', en: 'File deleted successfully' },
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
	confirmDeleteMaintenance: {
		vi: 'Bạn có chắc chắn muốn xóa lịch bảo trì này?',
		en: 'Are you sure you want to delete this maintenance schedule?',
	},
	createIncidentDesc: { vi: 'Tạo báo cáo sự cố mới.', en: 'Create a new incident report.' },
	incidentListDesc: {
		vi: 'Xem xét và quản lý các sự cố thang máy được báo cáo.',
		en: 'Review and manage reported elevator issues.',
	},
	updateIncidentDesc: { vi: 'Cập nhật thông tin chi tiết sự cố.', en: 'Update incident details.' },
	incidentDetailDesc: {
		vi: 'Xem thông tin chi tiết của sự cố đã báo cáo.',
		en: 'View detailed information of a reported incident.',
	},
	incidentDetails: { vi: 'Chi tiết sự cố', en: 'Incident Details' },
	issueDescription: { vi: 'Mô tả sự cố', en: 'Issue Description' },
	noAddress: { vi: 'Không có địa chỉ', en: 'No address' },
	noDescription: { vi: 'Không có mô tả', en: 'No description' },
	noFiles: { vi: 'Trống', en: 'Empty' },
	attachedFiles: { vi: 'Tài liệu đính kèm', en: 'Attached Files' },
	reportedDate: { vi: 'Ngày báo cáo', en: 'Reported Date' },
	searchIncidentsPlaceholder: { vi: 'Tìm sự cố, thang máy...', en: 'Search incidents, elevators...' },
	allPriorities: { vi: 'Tất cả ưu tiên', en: 'All priorities' },
	priorityHigh: { vi: 'Cao', en: 'High' },
	priorityMedium: { vi: 'Trung bình', en: 'Medium' },
	priorityLow: { vi: 'Thấp', en: 'Low' },
	status_new: { vi: 'Mới', en: 'New' },
	status_handling: { vi: 'Đang xử lý', en: 'In Progress' },
	status_handled: { vi: 'Đã xử lý', en: 'In Review' },
	status_done: { vi: 'Hoàn thành', en: 'Completed' },
	status_reopen: { vi: 'Mở lại', en: 'Reopened' },
	incidentId: { vi: 'Mã sự cố', en: 'Incident ID' },
	incidentTitle: { vi: 'Tiêu đề', en: 'Title' },
	incidentTitlePlaceholder: { vi: 'Nhập tiêu đề sự cố', en: 'Enter incident title' },
	reportedBy: { vi: 'Người báo cáo', en: 'Reported by' },
	updatedBy: { vi: 'Người cập nhật', en: 'Updated by' },
	incidentNotFound: { vi: 'Không tìm thấy sự cố.', en: 'Incident not found.' },
	describeProblemPlaceholder: { vi: 'Mô tả vấn đề', en: 'Describe the problem' },
	addAttachment: { vi: 'Thêm tệp đính kèm', en: 'Add attachment' },
	existingAttachments: { vi: 'Tệp đã đính kèm', en: 'Existing attachments' },
	newAttachments: { vi: 'Tệp mới', en: 'New attachments' },
	attachmentsAddedSuccessfully: { vi: 'Đính kèm tệp thành công', en: 'Attachments added successfully' },
	changeStatus: { vi: 'Thay đổi trạng thái', en: 'Change Status' },
	chooseNextStatus: { vi: 'Chọn trạng thái tiếp theo', en: 'Choose Next Status' },
	incidentInReview: { vi: 'Đã xử lý', en: 'In Review' },
	incidentClosed: { vi: 'Hoàn thành', en: 'Completed' },
	incidentReopened: { vi: 'Mở lại', en: 'Reopened' },
	occurrenceTime: { vi: 'Thời gian phát sinh', en: 'Occurrence time' },
	incidentInfo: { vi: 'Thông tin sự cố', en: 'Incident info' },
	contractDetails: { vi: 'Chi tiết hợp đồng', en: 'Contract details' },
	contractInformation: { vi: 'Thông tin hợp đồng', en: 'Contract Information' },
	contractExpiring: { vi: 'Sắp hết hạn', en: 'Expiring Soon' },

	// Change Password
	changePassword: { vi: 'Đổi mật khẩu', en: 'Change Password' },
	changePasswordDesc: {
		vi: 'Nhập mật khẩu cũ và mật khẩu mới để đổi mật khẩu của bạn.',
		en: 'Enter your current password and new password to change it.',
	},
	currentPassword: { vi: 'Mật khẩu hiện tại', en: 'Current Password' },
	newPassword: { vi: 'Mật khẩu mới', en: 'New Password' },
	confirmPassword: { vi: 'Xác nhận mật khẩu mới', en: 'Confirm New Password' },
	passwordsDoNotMatch: { vi: 'Mật khẩu xác nhận không khớp', en: 'Passwords do not match' },
	passwordChangedSuccessfully: { vi: 'Đổi mật khẩu thành công', en: 'Password changed successfully' },
	failedToChangePassword: { vi: 'Đổi mật khẩu không thành công', en: 'Failed to change password' },
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

export function LanguageProvider({ children }: Readonly<{ children: React.ReactNode }>) {
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

export type TranslationKey = Extract<keyof typeof translations, string>

function getCurrentLanguage(): Language {
	if (globalThis.window === undefined) {
		return 'vi'
	}

	const savedLang = localStorage.getItem('elevator_lang') as Language | null
	return savedLang ?? 'vi'
}

export function translate(key: TranslationKey): string {
	const language = getCurrentLanguage()
	return translations[key]?.[language] || String(key)
}
