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
	email: { vi: 'Email', en: 'Email' },
	phone: { vi: 'Số điện thoại', en: 'Phone' },
	role: { vi: 'Vai trò', en: 'Role' },
	super_admin: { vi: 'Quản trị viên cấp cao', en: 'Super Administrator' },
	admin: { vi: 'Quản trị viên', en: 'Administrator' },
	operator: { vi: 'Nhân viên vận hành', en: 'Operator' },
	viewer: { vi: 'Người xem', en: 'Viewer' },
	active: { vi: 'Hoạt động', en: 'Active' },
	disabled: { vi: 'Vô hiệu', en: 'Disabled' },
	disableUser: { vi: 'Vô hiệu hóa người dùng', en: 'Disable User' },
	enableUser: { vi: 'Kích hoạt người dùng', en: 'Enable User' },
	copyright: {
		vi: '© 2026 Hệ thống Quản lý Thang máy Piscada',
		en: '© 2026 Piscada Elevator Management System',
	},
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
