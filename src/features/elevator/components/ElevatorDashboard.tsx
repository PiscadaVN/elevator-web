import { useNavigate } from '@tanstack/react-router'
import { Building2, CheckCircle, Search, XCircle } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { CommonConfirmDialog } from '@/components/ui/common-confirm-dialog'
import { Input } from '@/components/ui/input'
import { PaginationControls } from '@/components/ui/pagination-controls'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useDeleteElevator, useElevators } from '@/hooks/api/useElevator'
import { useLanguage } from '@/i18n/LanguageContext'
import type { Elevator } from '@/types/api'

import { AddElevatorDialog } from './AddElevatorDialog'
import { EditElevatorDialog } from './EditElevatorDialog'
import { ElevatorTable } from './ElevatorTable'

const PAGE_SIZE = 10

export function ElevatorDashboard() {
	const navigate = useNavigate()

	const { t } = useLanguage()

	const { data: elevators = [], isLoading: loadingElevators } = useElevators()
	const deleteMutation = useDeleteElevator()

	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
	const [editingElevator, setEditingElevator] = useState<Elevator | null>(null)
	const [deletingElevatorId, setDeletingElevatorId] = useState<string | null>(null)

	const [searchTerm, setSearchTerm] = useState('')
	const [statusFilter, setStatusFilter] = useState('all')
	const [currentPage, setCurrentPage] = useState(1)

	const metrics = {
		total: elevators.length,
		available: elevators.filter((e) => e.status === 'active' || (e.status as string) === 'available').length,
		maintenance: elevators.filter((e) => (e.status as string) === 'maintenance').length,
		broken: elevators.filter((e) => e.status === 'out_of_order' || (e.status as string) === 'broken').length,
	}

	const filteredElevators = useMemo(
		() =>
			elevators.filter((e) => {
				const matchesSearch =
					e.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
					e.address?.toLowerCase().includes(searchTerm.toLowerCase())
				const matchesStatus = statusFilter === 'all' || e.status === statusFilter
				return matchesSearch && matchesStatus
			}),
		[elevators, searchTerm, statusFilter],
	)

	const totalPages = Math.max(1, Math.ceil(filteredElevators.length / PAGE_SIZE))
	const activePage = Math.min(currentPage, totalPages)

	const paginatedElevators = useMemo(() => {
		const startIndex = (activePage - 1) * PAGE_SIZE
		return filteredElevators.slice(startIndex, startIndex + PAGE_SIZE)
	}, [activePage, filteredElevators])

	const handleDeleteElevator = (id: string) => {
		setDeletingElevatorId(id)
	}

	const handleConfirmDeleteElevator = async () => {
		if (!deletingElevatorId) return

		try {
			await deleteMutation.mutateAsync(deletingElevatorId)
			setDeletingElevatorId(null)
		} catch {
			// Handled by mutation hook toast.
		}
	}

	const openEditDialog = (elevator: Elevator) => {
		setEditingElevator(elevator)
	}

	const openViewDrawer = (elevatorId: string) => {
		navigate({ to: `/elevator/${elevatorId}` })
	}

	return (
		<div className="p-[32px_36px] max-w-350 mx-auto">
			<header className="flex items-start justify-between mb-7">
				<div>
					<h1 className="text-[26px] font-extrabold text-foreground mb-1">{t('appName')}</h1>
					<p className="text-[13px] text-muted-foreground font-medium">{t('elevatorOverviewDesc')}</p>
				</div>
				<Button
					className="flex items-center gap-1.75 bg-primary text-white border-none rounded-2.5 px-4.5 py-2.5 text-[13px] font-bold cursor-pointer hover:bg-orange-600 transition-colors whitespace-nowrap"
					onClick={() => setIsAddDialogOpen(true)}
				>
					<svg
						width="15"
						height="15"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M5 12h14" />
						<path d="M12 5v14" />
					</svg>
					{t('addElevator')}
				</Button>
			</header>

			{/* STATS */}
			<div className="grid grid-cols-4 gap-3 mb-5.5">
				<div className="bg-card border border-border rounded-xl p-[14px_16px] flex items-center gap-2.5">
					<div className="w-9 h-9 rounded-2.25 flex items-center justify-center shrink-0 bg-[#eff6ff] text-[#3b82f6]">
						<Building2 className="w-4 h-4" />
					</div>
					<div>
						<div className="text-[18px] font-extrabold text-foreground leading-none mb-0.5">{metrics.total}</div>
						<div className="text-[11px] font-semibold text-muted-foreground">{t('totalElevators')}</div>
					</div>
				</div>
				<div className="bg-card border border-border rounded-xl p-[14px_16px] flex items-center gap-2.5">
					<div className="w-9 h-9 rounded-2.25 flex items-center justify-center shrink-0 bg-[#ecfdf5] text-[#10b981]">
						<CheckCircle className="w-4 h-4" />
					</div>
					<div>
						<div className="text-[18px] font-extrabold text-foreground leading-none mb-0.5">{metrics.available}</div>
						<div className="text-[11px] font-semibold text-muted-foreground">{t('elevatorStatus_available')}</div>
					</div>
				</div>
				<div className="bg-card border border-border rounded-xl p-[14px_16px] flex items-center gap-2.5">
					<div className="w-9 h-9 rounded-2.25 flex items-center justify-center shrink-0 bg-[#fef2f2] text-[#ef4444]">
						<XCircle className="w-4 h-4" />
					</div>
					<div>
						<div className="text-[18px] font-extrabold text-foreground leading-none mb-0.5">{metrics.broken}</div>
						<div className="text-[11px] font-semibold text-muted-foreground">{t('elevatorStatus_out_of_order')}</div>
					</div>
				</div>
			</div>

			{/* TOOLBAR */}
			<div className="flex items-center gap-2.5 mb-4">
				<div className="flex items-center gap-2 bg-card border border-border rounded-md rounded-2.25 p-[8px_13px] flex-1 max-w-80">
					<Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
					<Input
						type="text"
						placeholder={t('searchElevatorPlaceholder')}
						className="border-none outline-none font-inherit text-[13px] text-foreground bg-transparent flex-1 placeholder:text-muted-foreground"
						value={searchTerm}
						onChange={(e) => {
							setSearchTerm(e.target.value)
							setCurrentPage(1)
						}}
					/>
				</div>
				<Select
					value={statusFilter}
					onValueChange={(value) => {
						setStatusFilter(value)
						setCurrentPage(1)
					}}
				>
					<SelectTrigger className="w-auto min-w-40 bg-card border border-border rounded-2.25 p-[8px_12px] h-auto font-inherit text-[13px] font-semibold text-foreground">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">{t('allStatuses')}</SelectItem>
						<SelectItem value="active">{t('elevatorStatus_available')}</SelectItem>
						<SelectItem value="out_of_order">{t('elevatorStatus_out_of_order')}</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<ElevatorTable
				elevators={paginatedElevators}
				isLoading={loadingElevators}
				onEdit={openEditDialog}
				onView={openViewDrawer}
				onDelete={handleDeleteElevator}
				isDeleting={deleteMutation.isPending}
			/>

			<PaginationControls
				currentPage={activePage}
				totalItems={filteredElevators.length}
				pageSize={PAGE_SIZE}
				onPageChange={setCurrentPage}
			/>

			{isAddDialogOpen && <AddElevatorDialog isOpen={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} />}

			{editingElevator && (
				<EditElevatorDialog
					isOpen={!!editingElevator}
					onClose={() => setEditingElevator(null)}
					elevator={editingElevator}
				/>
			)}

			<CommonConfirmDialog
				open={!!deletingElevatorId}
				onOpenChange={(open) => {
					if (!open) setDeletingElevatorId(null)
				}}
				title={t('delete')}
				content={t('confirmDeleteElevator')}
				cancelText={t('cancel')}
				submitText={deleteMutation.isPending ? t('deleting') : t('delete')}
				onSubmit={handleConfirmDeleteElevator}
				isPending={deleteMutation.isPending}
			/>
		</div>
	)
}
