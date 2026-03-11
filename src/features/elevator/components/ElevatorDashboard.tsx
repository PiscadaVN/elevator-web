import { useNavigate } from '@tanstack/react-router'
import { LogOut, Plus, User as UserIcon } from 'lucide-react'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useDeleteElevator, useElevators, useUpdateElevator } from '@/hooks/api/useElevator'
import { useLanguage } from '@/i18n/LanguageContext'
import type { Elevator, ElevatorUpdate } from '@/types/api'

import { AddElevatorDialog } from './AddElevatorDialog'
import { EditElevatorDialog } from './EditElevatorDialog'
import { ElevatorTable } from './ElevatorTable'

export function ElevatorDashboard() {
	const navigate = useNavigate()

	const { user, logout } = useAuth()
	const { t } = useLanguage()

	const { data: elevators = [], isLoading: loadingElevators } = useElevators()
	const updateMutation = useUpdateElevator()
	const deleteMutation = useDeleteElevator()

	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
	const [editingElevator, setEditingElevator] = useState<Elevator | null>(null)

	// const stats = useMemo(() => {
	// 	return {
	// 		total: elevators.length,
	// 		available: elevators.filter((e) => e.status === 'available').length,
	// 		maintenance: elevators.filter((e) => e.status === 'maintenance').length,
	// 		incidents: elevators.filter((e) => e.status === 'out_of_order').length,
	// 	}
	// }, [elevators])

	const handleCompleteMaintenance = async (id: string) => {
		try {
			const updateData: ElevatorUpdate = {
				status: 'active',
			}

			await updateMutation.mutateAsync({ elevatorId: id, data: updateData })
		} catch (_error) {
			alert(t('failedToCompleteMaintenance'))
		}
	}

	const handleDeleteElevator = async (id: string) => {
		if (!confirm(t('confirmDeleteElevator'))) return

		try {
			await deleteMutation.mutateAsync(id)
		} catch (_error) {
			alert(t('failedToDeleteElevator'))
		}
	}

	const openEditDialog = (elevator: Elevator) => {
		setEditingElevator(elevator)
	}

	return (
		<div className="p-8 space-y-8 max-w-7xl mx-auto">
			<header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
				<div>
					<h1 className="text-4xl font-bold tracking-tight">{t('appName')}</h1>
					<p className="text-muted-foreground mt-2">{t('elevatorOverviewDesc')}</p>
				</div>
				<div className="flex items-center gap-4">
					<div className="flex items-center gap-3 bg-white p-2 px-4 rounded-full border shadow-sm">
						<div className="p-1.5 bg-primary/5 rounded-full">
							<UserIcon className="w-4 h-4 text-primary" />
						</div>
						<div className="text-sm">
							<span className="font-medium">{user?.name}</span>
							<Badge variant="outline" className="ml-2 uppercase text-[10px] py-0">
								{user?.role}
							</Badge>
						</div>
						<Button
							variant="ghost"
							size="icon"
							className="h-8 w-8 text-muted-foreground hover:text-destructive"
							onClick={logout}
						>
							<LogOut className="w-4 h-4" />
						</Button>
					</div>
				</div>
			</header>

			{/*<ElevatorStats stats={stats} activeFilter={statusFilter} onFilterChange={setStatusFilter} />*/}

			<div className="flex justify-end mb-4">
				<Button onClick={() => setIsAddDialogOpen(true)}>
					<Plus className="w-4 h-4 mr-2" /> {t('addElevator')}
				</Button>
			</div>

			<ElevatorTable
				elevators={elevators}
				isLoading={loadingElevators}
				onCompleteMaintenance={handleCompleteMaintenance}
				onEdit={openEditDialog}
				onView={(id) => navigate({ to: `/elevator/${id}` })}
				onDelete={handleDeleteElevator}
				isDeleting={deleteMutation.isPending}
			/>

			{isAddDialogOpen && <AddElevatorDialog isOpen={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} />}

			{editingElevator && (
				<EditElevatorDialog
					isOpen={!!editingElevator}
					onClose={() => setEditingElevator(null)}
					elevator={editingElevator}
				/>
			)}
		</div>
	)
}
