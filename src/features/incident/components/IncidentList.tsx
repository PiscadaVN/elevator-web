import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { AlertCircle, CircleCheckBig, ClipboardCheck, LoaderCircle, RotateCcw, Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { fileApi } from '@/api/file.api'
import { CommonConfirmDialog } from '@/components/ui/common-confirm-dialog'
import { Input } from '@/components/ui/input'
import { PaginationControls } from '@/components/ui/pagination-controls'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { canTransitionIncidentStatus, IncidentStatusEnum } from '@/features/incident/helpers/status-transition'
import { useElevators } from '@/hooks/api/useElevator'
import { fileKeys, useDeleteFile, useFilesByEntity } from '@/hooks/api/useFile'
import {
	useCreateIncident,
	useDeleteIncident,
	useIncident,
	useIncidents,
	useUpdateIncident,
} from '@/hooks/api/useIncident'
import { useLanguage } from '@/i18n/LanguageContext'
import type {
	Incident,
	IncidentCreate,
	IncidentFormData,
	IncidentStatus,
	IncidentUpdate,
	PendingAttachment,
} from '@/types/api'

import { AddIncidentDialog } from './AddIncidentDialog'
import { EditIncidentDialog } from './EditIncidentDialog'
import { IncidentTable } from './IncidentTable'

const PAGE_SIZE = 10

function readFileAsDataUrl(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.onload = () => {
			if (typeof reader.result === 'string') {
				resolve(reader.result)
				return
			}
			reject(new Error('Failed to read file content'))
		}
		reader.onerror = () => reject(new Error('Failed to read file'))
		reader.readAsDataURL(file)
	})
}

export function IncidentList() {
	const navigate = useNavigate()
	const queryClient = useQueryClient()

	const { t } = useLanguage()

	const { data: incidents = [], isLoading } = useIncidents()
	const { data: elevators = [] } = useElevators()
	const createMutation = useCreateIncident()
	const updateMutation = useUpdateIncident()
	const deleteMutation = useDeleteIncident()
	const deleteFileMutation = useDeleteFile()

	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
	const [editingIncidentId, setEditingIncidentId] = useState<string | null>(null)
	const [deletingIncidentId, setDeletingIncidentId] = useState<string | null>(null)
	const { data: editingIncidentDetail, isLoading: isEditingIncidentLoading } = useIncident(editingIncidentId ?? '')
	const { data: existingAttachments = [] } = useFilesByEntity('incident', editingIncidentId ?? '')

	const [searchTerm, setSearchTerm] = useState('')
	const [statusFilter, setStatusFilter] = useState('all')
	const [priorityFilter, setPriorityFilter] = useState('all')
	const [currentPage, setCurrentPage] = useState(1)
	const [addFormErrors, setAddFormErrors] = useState<Partial<Record<'elevatorId' | 'title' | 'description', string>>>(
		{},
	)
	const [editFormErrors, setEditFormErrors] = useState<Partial<Record<'title' | 'description', string>>>({})
	const [isUploadingAttachments, setIsUploadingAttachments] = useState(false)
	const [deletingAttachmentId, setDeletingAttachmentId] = useState<string | null>(null)

	const [formData, setFormData] = useState<IncidentFormData>({
		title: '',
		elevatorId: '',
		description: '',
		priority: 1,
		status: IncidentStatusEnum.NEW,
		attachments: [],
	})

	useEffect(() => {
		if (!editingIncidentDetail) {
			return
		}

		setFormData({
			title: editingIncidentDetail.title ?? '',
			elevatorId: editingIncidentDetail.elevatorId,
			description: editingIncidentDetail.description ?? '',
			priority: editingIncidentDetail.priority,
			status: editingIncidentDetail.status,
			attachments: [],
		})
	}, [editingIncidentDetail])

	const addAttachmentsToForm = async (files: FileList | null) => {
		if (!files || files.length === 0) {
			return
		}

		const attachments = await Promise.all(
			Array.from(files).map(async (file) => {
				const fileUrl = await readFileAsDataUrl(file)
				return {
					fileName: file.name,
					fileType: file.type || null,
					fileUrl,
				} as PendingAttachment
			}),
		)

		setFormData((prev) => ({
			...prev,
			attachments: [...prev.attachments, ...attachments],
		}))
	}

	const removeAttachmentFromForm = (index: number) => {
		setFormData((prev) => ({
			...prev,
			attachments: prev.attachments.filter((_, attachmentIndex) => attachmentIndex !== index),
		}))
	}

	const attachFilesToIncident = async (incidentId: string, attachments: PendingAttachment[]) => {
		if (attachments.length === 0) {
			return
		}

		setIsUploadingAttachments(true)
		try {
			await Promise.all(
				attachments.map((attachment) =>
					fileApi.createFile({
						entityType: 'incident',
						entityId: incidentId,
						fileName: attachment.fileName,
						fileType: attachment.fileType,
						fileUrl: attachment.fileUrl,
					}),
				),
			)
			await queryClient.invalidateQueries({ queryKey: fileKeys.byEntity('incident', incidentId) })
			toast.success(t('attachmentsAddedSuccessfully'))
		} catch {
			toast.error(t('failedToCreateFile'))
		} finally {
			setIsUploadingAttachments(false)
		}
	}

	const handleAddIncident = async () => {
		const errors: Partial<Record<'elevatorId' | 'title' | 'description', string>> = {}

		if (!formData.elevatorId) {
			errors.elevatorId = t('missingRequiredFields')
		}
		if (!formData.title.trim()) {
			errors.title = t('missingRequiredFields')
		}
		if (!formData.description.trim()) {
			errors.description = t('missingRequiredFields')
		}

		setAddFormErrors(errors)
		if (Object.keys(errors).length > 0) return

		try {
			const newIncidentData: IncidentCreate = {
				title: formData.title.trim(),
				elevatorId: formData.elevatorId,
				description: formData.description,
				priority: formData.priority,
				status: IncidentStatusEnum.NEW,
			}

			const createdIncident = await createMutation.mutateAsync(newIncidentData)
			await attachFilesToIncident(createdIncident.id, formData.attachments)
			setIsAddDialogOpen(false)
			resetForm()
		} catch {
			// Handled by mutation hook toast.
		}
	}

	const handleUpdateIncident = async () => {
		if (!editingIncidentId || !editingIncidentDetail) return

		const errors: Partial<Record<'title' | 'description', string>> = {}
		if (!formData.title.trim()) {
			errors.title = t('missingRequiredFields')
		}
		if (!formData.description.trim()) {
			errors.description = t('missingRequiredFields')
		}

		setEditFormErrors(errors)
		if (Object.keys(errors).length > 0) return

		try {
			if (formData.status && !canTransitionIncidentStatus(editingIncidentDetail.status, formData.status)) {
				toast.warning(t('invalidIncidentStatusTransition'))
				return
			}

			const updateData: IncidentUpdate = {
				title: formData.title.trim(),
				description: formData.description,
				priority: formData.priority,
				status: formData.status,
			}

			await updateMutation.mutateAsync({ incidentId: editingIncidentId, data: updateData })
			await attachFilesToIncident(editingIncidentId, formData.attachments)
			setEditingIncidentId(null)
			resetForm()
		} catch {
			// Handled by mutation hook toast.
		}
	}

	const handleDeleteIncident = (id: string) => {
		setDeletingIncidentId(id)
	}

	const handleConfirmDeleteIncident = async () => {
		if (!deletingIncidentId) return

		try {
			await deleteMutation.mutateAsync(deletingIncidentId)
			setDeletingIncidentId(null)
		} catch {
			// Handled by mutation hook toast.
		}
	}

	const handleUpdateStatus = async (id: string, status: IncidentStatus) => {
		try {
			const incident = incidents.find((item) => item.id === id)
			if (!incident) {
				return
			}

			if (!canTransitionIncidentStatus(incident.status, status)) {
				toast.warning(t('invalidIncidentStatusTransition'))
				return
			}

			await updateMutation.mutateAsync({
				incidentId: id,
				data: { status },
			})
		} catch {
			// Handled by mutation hook toast.
		}
	}

	const handleRemoveExistingAttachment = async (fileId: string) => {
		if (!editingIncidentId) {
			return
		}

		setDeletingAttachmentId(fileId)
		try {
			await deleteFileMutation.mutateAsync(fileId)
			await queryClient.invalidateQueries({ queryKey: fileKeys.byEntity('incident', editingIncidentId) })
		} finally {
			setDeletingAttachmentId(null)
		}
	}

	const resetForm = () => {
		setFormData({
			title: '',
			elevatorId: '',
			description: '',
			priority: 1,
			status: IncidentStatusEnum.NEW,
			attachments: [],
		})
		setAddFormErrors({})
		setEditFormErrors({})
	}

	const openEditDialog = (incident: Incident) => {
		setEditingIncidentId(incident.id)
		setEditFormErrors({})
		setFormData({
			title: '',
			elevatorId: '',
			description: '',
			priority: 1,
			status: IncidentStatusEnum.NEW,
			attachments: [],
		})
	}

	const openDetailDrawer = (incidentId: string) => {
		navigate({ to: `/incident/${incidentId}` })
	}

	const metrics = {
		new: incidents.filter((i) => i.status === IncidentStatusEnum.NEW).length,
		inProgress: incidents.filter((i) => i.status === IncidentStatusEnum.IN_PROGRESS).length,
		inReview: incidents.filter((i) => i.status === IncidentStatusEnum.IN_REVIEW).length,
		closed: incidents.filter((i) => i.status === IncidentStatusEnum.CLOSE).length,
		reopened: incidents.filter((i) => i.status === IncidentStatusEnum.REOPEN).length,
	}

	const filteredIncidents = useMemo(
		() =>
			incidents.filter((i) => {
				const matchesSearch =
					i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
					i.elevator.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
					i.description?.toLowerCase().includes(searchTerm.toLowerCase())
				const matchesStatus = statusFilter === 'all' || i.status === statusFilter
				const matchesPriority = priorityFilter === 'all' || i.priority.toString() === priorityFilter
				return matchesSearch && matchesStatus && matchesPriority
			}),
		[incidents, searchTerm, statusFilter, priorityFilter],
	)

	const totalPages = Math.max(1, Math.ceil(filteredIncidents.length / PAGE_SIZE))
	const activePage = Math.min(currentPage, totalPages)

	const paginatedIncidents = useMemo(() => {
		const startIndex = (activePage - 1) * PAGE_SIZE
		return filteredIncidents.slice(startIndex, startIndex + PAGE_SIZE)
	}, [activePage, filteredIncidents])

	const statCards = [
		{
			key: 'new',
			count: metrics.new,
			label: t('status_new'),
			icon: AlertCircle,
			iconBg: 'bg-[#fef2f2]',
			iconColor: 'text-[#ef4444]',
		},
		{
			key: 'inProgress',
			count: metrics.inProgress,
			label: t('status_handling'),
			icon: LoaderCircle,
			iconBg: 'bg-[#fff7ed]',
			iconColor: 'text-[#f97316]',
		},
		{
			key: 'inReview',
			count: metrics.inReview,
			label: t('status_handled'),
			icon: ClipboardCheck,
			iconBg: 'bg-[#eff6ff]',
			iconColor: 'text-[#3b82f6]',
		},
		{
			key: 'closed',
			count: metrics.closed,
			label: t('status_done'),
			icon: CircleCheckBig,
			iconBg: 'bg-[#ecfdf5]',
			iconColor: 'text-[#10b981]',
		},
		{
			key: 'reopened',
			count: metrics.reopened,
			label: t('status_reopen'),
			icon: RotateCcw,
			iconBg: 'bg-[#fff1f2]',
			iconColor: 'text-[#dc2626]',
		},
	]

	return (
		<div className="p-[32px_36px] max-w-350 mx-auto">
			<header className="flex items-start justify-between mb-7">
				<div>
					<h1 className="text-[26px] font-extrabold text-foreground mb-1">{t('incidents')}</h1>
					<p className="text-[13px] text-muted-foreground font-medium">{t('incidentListDesc')}</p>
				</div>
				<AddIncidentDialog
					open={isAddDialogOpen}
					onOpenChange={(open) => {
						setIsAddDialogOpen(open)
						if (!open) {
							resetForm()
						}
					}}
					formData={formData}
					errors={addFormErrors}
					setFormData={setFormData}
					setErrors={setAddFormErrors}
					elevators={elevators}
					onSubmit={handleAddIncident}
					onSelectFiles={addAttachmentsToForm}
					onRemoveAttachment={removeAttachmentFromForm}
					isPending={createMutation.isPending || isUploadingAttachments}
				/>
			</header>

			{/* STATS */}
			<div className="grid grid-cols-5 gap-3 mb-5.5">
				{statCards.map((card) => {
					const Icon = card.icon
					return (
						<div
							key={card.key}
							className="bg-card border border-border rounded-xl p-[14px_16px] flex items-center gap-2.5"
						>
							<div
								className={`w-9 h-9 rounded-2.25 flex items-center justify-center shrink-0 ${card.iconBg} ${card.iconColor}`}
							>
								<Icon className="w-4 h-4" />
							</div>
							<div>
								<div className="text-[18px] font-extrabold text-foreground leading-none mb-0.5">{card.count}</div>
								<div className="text-[11px] font-semibold text-muted-foreground">{card.label}</div>
							</div>
						</div>
					)
				})}
			</div>

			{/* TOOLBAR */}
			<div className="flex items-center gap-2.5 mb-4">
				<div className="flex items-center gap-2 bg-card border border-border rounded-2.25 p-[8px_13px] flex-1 max-w-80">
					<Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
					<Input
						type="text"
						placeholder={t('searchIncidentsPlaceholder')}
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
						<SelectItem value={IncidentStatusEnum.NEW}>{t('status_new')}</SelectItem>
						<SelectItem value={IncidentStatusEnum.IN_PROGRESS}>{t('status_handling')}</SelectItem>
						<SelectItem value={IncidentStatusEnum.IN_REVIEW}>{t('status_handled')}</SelectItem>
						<SelectItem value={IncidentStatusEnum.CLOSE}>{t('status_done')}</SelectItem>
						<SelectItem value={IncidentStatusEnum.REOPEN}>{t('status_reopen')}</SelectItem>
					</SelectContent>
				</Select>
				<Select
					value={priorityFilter}
					onValueChange={(value) => {
						setPriorityFilter(value)
						setCurrentPage(1)
					}}
				>
					<SelectTrigger className="w-auto min-w-40 bg-card border border-border rounded-2.25 p-[8px_12px] h-auto font-inherit text-[13px] font-semibold text-foreground">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">{t('allPriorities')}</SelectItem>
						<SelectItem value="1">🔴 {t('priorityHigh')}</SelectItem>
						<SelectItem value="2">🟡 {t('priorityMedium')}</SelectItem>
						<SelectItem value="3">⚪ {t('priorityLow')}</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<IncidentTable
				incidents={paginatedIncidents}
				isLoading={isLoading}
				onView={openDetailDrawer}
				onEdit={openEditDialog}
				onDelete={handleDeleteIncident}
				onUpdateStatus={handleUpdateStatus}
			/>

			<PaginationControls
				currentPage={activePage}
				totalItems={filteredIncidents.length}
				pageSize={PAGE_SIZE}
				onPageChange={setCurrentPage}
			/>

			<EditIncidentDialog
				open={!!editingIncidentId}
				incident={editingIncidentDetail ?? null}
				isLoading={isEditingIncidentLoading}
				onClose={() => {
					setEditingIncidentId(null)
					resetForm()
				}}
				formData={formData}
				setFormData={setFormData}
				errors={editFormErrors}
				setErrors={setEditFormErrors}
				existingAttachments={existingAttachments}
				onSelectFiles={addAttachmentsToForm}
				onRemoveAttachment={removeAttachmentFromForm}
				onRemoveExistingAttachment={handleRemoveExistingAttachment}
				deletingExistingAttachmentId={deletingAttachmentId}
				onSubmit={handleUpdateIncident}
				isPending={updateMutation.isPending || isUploadingAttachments}
			/>

			<CommonConfirmDialog
				open={!!deletingIncidentId}
				onOpenChange={(open) => {
					if (!open) setDeletingIncidentId(null)
				}}
				title={t('delete')}
				content={t('confirmDeleteIncident')}
				cancelText={t('cancel')}
				submitText={deleteMutation.isPending ? t('deleting') : t('delete')}
				onSubmit={handleConfirmDeleteIncident}
				isPending={deleteMutation.isPending}
			/>
		</div>
	)
}
