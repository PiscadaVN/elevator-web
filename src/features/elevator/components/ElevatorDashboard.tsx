import { useState, useEffect, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Elevator, ElevatorStatus, User } from "@/types"
import { Activity, AlertTriangle, CheckCircle2, Settings, LogOut, Plus, User as UserIcon, Trash2, Edit } from "lucide-react"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { useLanguage } from "@/i18n/LanguageContext"

const INITIAL_ELEVATORS: Elevator[] = [
  { 
    id: "E01", 
    name: "Elevator 1", 
    building: "Tower A", 
    floorRange: "1-20", 
    status: "available", 
    lastUpdated: "10:32 AM",
    maintenanceDate: "2026-03-20",
    assignedUserId: "U01"
  },
  { 
    id: "E02", 
    name: "Elevator 2", 
    building: "Tower A", 
    floorRange: "1-20", 
    status: "maintenance", 
    lastUpdated: "09:10 AM",
    maintenanceDate: "2026-02-28",
    assignedUserId: "U02"
  },
  { 
    id: "E03", 
    name: "Elevator 3", 
    building: "Tower B", 
    floorRange: "1-30", 
    status: "out_of_order", 
    lastUpdated: "08:55 AM",
    maintenanceDate: "2026-02-20",
    assignedUserId: "U01"
  },
  { 
    id: "E04", 
    name: "Elevator 4", 
    building: "Tower B", 
    floorRange: "1-30", 
    status: "available", 
    lastUpdated: "11:15 AM",
    maintenanceDate: "2026-04-15",
    assignedUserId: null
  },
]

export function ElevatorDashboard() {
  const { user, logout } = useAuth()
  const { t } = useLanguage()
  const [elevators, setElevators] = useState<Elevator[]>(INITIAL_ELEVATORS)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingElevator, setEditingElevator] = useState<Elevator | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('elevator_data')
    if (stored) {
      setElevators(JSON.parse(stored))
    }
  }, [])

  const saveElevators = (newElevators: Elevator[]) => {
    setElevators(newElevators)
    localStorage.setItem('elevator_data', JSON.stringify(newElevators))
  }

  // Form State
  const [formData, setFormData] = useState<Partial<Elevator>>({
    name: "",
    building: "",
    floorRange: "",
    status: "available",
    maintenanceDate: new Date().toISOString().split('T')[0],
    assignedUserId: null,
  })

  const stats = useMemo(() => {
    return {
      total: elevators.length,
      available: elevators.filter(e => e.status === "available").length,
      maintenance: elevators.filter(e => e.status === "maintenance").length,
      outOfOrder: elevators.filter(e => e.status === "out_of_order").length,
    }
  }, [elevators])

  const handleAddElevator = () => {
    if (!formData.name) return
    const newElevator: Elevator = {
      id: `E0${elevators.length + 1}`,
      name: formData.name,
      building: formData.building || "Tower A",
      floorRange: formData.floorRange || "1-10",
      status: formData.status as ElevatorStatus,
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      maintenanceDate: formData.maintenanceDate || new Date().toISOString().split('T')[0],
      assignedUserId: formData.assignedUserId || null,
    }
    saveElevators([...elevators, newElevator])
    setIsAddDialogOpen(false)
    resetForm()
  }

  const handleUpdateElevator = () => {
    if (!editingElevator) return
    const updatedElevators = elevators.map(e => 
      e.id === editingElevator.id 
        ? { 
            ...editingElevator, 
            ...formData, 
            lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
          } as Elevator 
        : e
    )
    saveElevators(updatedElevators)
    setEditingElevator(null)
    resetForm()
  }

  const handleDeleteElevator = (id: string) => {
    if (confirm("Are you sure you want to delete this elevator?")) {
      saveElevators(elevators.filter(e => e.id !== id))
    }
  }

  const resetForm = () => {
    setFormData({ 
      name: "", 
      building: "", 
      floorRange: "", 
      status: "available",
      maintenanceDate: new Date().toISOString().split('T')[0],
      assignedUserId: null
    })
  }

  const openEditDialog = (elevator: Elevator) => {
    setEditingElevator(elevator)
    setFormData({
      name: elevator.name,
      building: elevator.building,
      floorRange: elevator.floorRange,
      status: elevator.status,
      maintenanceDate: elevator.maintenanceDate,
      assignedUserId: elevator.assignedUserId,
    })
  }

  const getMaintenanceStatus = (date: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const maintenanceDate = new Date(date)
    maintenanceDate.setHours(0, 0, 0, 0)
    
    const diffTime = maintenanceDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return "overdue"
    if (diffDays <= 7) return "due_soon"
    return "normal"
  }

  const getStatusBadge = (status: Elevator["status"]) => {
    switch (status) {
      case "available":
        return <Badge variant="success">{t('available')}</Badge>
      case "maintenance":
        return <Badge variant="warning">{t('maintenance')}</Badge>
      case "out_of_order":
        return <Badge variant="destructive">{t('outOfOrder')}</Badge>
    }
  }

  const getMaintenanceBadge = (date: string) => {
    const status = getMaintenanceStatus(date)
    switch (status) {
      case "overdue":
        return <Badge variant="destructive" className="ml-2">{t('overdue')}</Badge>
      case "due_soon":
        return <Badge variant="warning" className="ml-2">{t('dueSoon')}</Badge>
      default:
        return <Badge variant="outline" className="ml-2 text-green-600 border-green-200">{t('normal')}</Badge>
    }
  }

  // Get users for assignment
  const mockUsers: User[] = JSON.parse(localStorage.getItem('elevator_users_db') || '[]')
  const operators = mockUsers.filter(u => u.role === 'operator')

  const filteredElevators = useMemo(() => {
    if (user?.role === 'admin' || user?.role === 'viewer') return elevators
    // Operators only see assigned elevators
    return elevators.filter(e => e.assignedUserId === user?.id)
  }, [elevators, user])

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
              <Badge variant="outline" className="ml-2 uppercase text-[10px] py-0">{user?.role}</Badge>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={logout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('totalUnits')}</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">{t('connectedSystems')}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border-green-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">{t('available')}</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{stats.available}</div>
            <p className="text-xs text-green-600/80">{t('operational')}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/5 border-yellow-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-700">{t('maintenance')}</CardTitle>
            <Settings className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700">{stats.maintenance}</div>
            <p className="text-xs text-yellow-600/80">{t('scheduledChecks')}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-500/10 to-rose-500/5 border-red-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-700">{t('outOfOrder')}</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">{stats.outOfOrder}</div>
            <p className="text-xs text-red-600/80">{t('requiresAttention')}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{t('elevatorOverview')}</CardTitle>
            <CardDescription>{t('elevatorOverviewDesc')}</CardDescription>
          </div>
          {user?.role === 'admin' && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" /> {t('addElevator')}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('addElevator')}</DialogTitle>
                  <DialogDescription>{t('addElevatorDesc')}</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label>{t('elevatorName')}</Label>
                    <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder={t('elevatorNamePlaceholder')} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{t('building')}</Label>
                      <Input value={formData.building} onChange={e => setFormData({...formData, building: e.target.value})} placeholder={t('buildingPlaceholder')} />
                    </div>
                    <div className="space-y-2">
                      <Label>{t('floorRange')}</Label>
                      <Input value={formData.floorRange} onChange={e => setFormData({...formData, floorRange: e.target.value})} placeholder={t('floorRangePlaceholder')} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{t('maintenanceDate')}</Label>
                      <Input type="date" value={formData.maintenanceDate} onChange={e => setFormData({...formData, maintenanceDate: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>{t('status')}</Label>
                      <Select value={formData.status} onValueChange={v => setFormData({...formData, status: v as ElevatorStatus})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="available">{t('available')}</SelectItem>
                          <SelectItem value="maintenance">{t('maintenance')}</SelectItem>
                          <SelectItem value="out_of_order">{t('outOfOrder')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>{t('assignOperator')}</Label>
                    <Select value={formData.assignedUserId || "none"} onValueChange={v => setFormData({...formData, assignedUserId: v === "none" ? null : v})}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('unassigned')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">{t('unassigned')}</SelectItem>
                        {operators.map(op => (
                          <SelectItem key={op.id} value={op.id}>{op.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddElevator}>{t('confirmAdd')}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>{t('building')}</TableHead>
                <TableHead>{t('floors')}</TableHead>
                <TableHead>{t('maintenance')}</TableHead>
                <TableHead>{t('assignedTo')}</TableHead>
                <TableHead>{t('status')}</TableHead>
                <TableHead>{t('lastUpdated')}</TableHead>
                {user?.role !== 'viewer' && <TableHead className="text-right">{t('actions')}</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredElevators.map((elevator) => (
                <TableRow key={elevator.id}>
                  <TableCell className="font-bold">{elevator.id}</TableCell>
                  <TableCell>{elevator.building}</TableCell>
                  <TableCell>{elevator.floorRange}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-xs">{elevator.maintenanceDate}</span>
                      {getMaintenanceBadge(elevator.maintenanceDate)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {elevator.assignedUserId ? (
                      <Badge variant="outline" className="text-[10px] bg-slate-50">
                        {mockUsers.find(u => u.id === elevator.assignedUserId)?.name || elevator.assignedUserId}
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">{t('unassigned')}</span>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(elevator.status)}</TableCell>
                  <TableCell className="text-muted-foreground">{elevator.lastUpdated}</TableCell>
                  {user?.role !== 'viewer' && (
                    <TableCell className="text-right space-x-2">
                      <Dialog open={!!editingElevator && editingElevator.id === elevator.id} onOpenChange={(open) => !open && setEditingElevator(null)}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(elevator)}>
                            <Edit className="w-4 h-4 text-blue-600" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{t('edit')}: {elevator.id}</DialogTitle>
                            <DialogDescription>{t('elevatorOverviewDesc')}</DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>{t('maintenanceDate')}</Label>
                                <Input type="date" value={formData.maintenanceDate} onChange={e => setFormData({...formData, maintenanceDate: e.target.value})} />
                              </div>
                              <div className="space-y-2">
                                <Label>{t('status')}</Label>
                                <Select value={formData.status} onValueChange={v => setFormData({...formData, status: v as ElevatorStatus})}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="available">{t('available')}</SelectItem>
                                    <SelectItem value="maintenance">{t('maintenance')}</SelectItem>
                                    <SelectItem value="out_of_order">{t('outOfOrder')}</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            {user?.role === 'admin' && (
                              <div className="space-y-2">
                                <Label>{t('assignedTo')}</Label>
                                <Select value={formData.assignedUserId || "none"} onValueChange={v => setFormData({...formData, assignedUserId: v === "none" ? null : v})}>
                                  <SelectTrigger>
                                    <SelectValue placeholder={t('unassigned')} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="none">{t('unassigned')}</SelectItem>
                                    {operators.map(op => (
                                      <SelectItem key={op.id} value={op.id}>{op.name}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            )}
                          </div>
                          <DialogFooter>
                            <Button onClick={handleUpdateElevator}>{t('save')}</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      {user?.role === 'admin' && (
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteElevator(elevator.id)}>
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
