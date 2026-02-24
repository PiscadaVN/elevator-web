import { useState, useMemo } from "react"
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
import type { Elevator, ElevatorStatus } from "@/types"
import { Activity, AlertTriangle, CheckCircle2, Settings, LogOut, Plus, User as UserIcon, Trash2, Edit } from "lucide-react"
import { useAuth } from "@/features/auth/hooks/useAuth"

const INITIAL_ELEVATORS: Elevator[] = [
  { id: "E01", name: "Elevator 1", building: "Tower A", floorRange: "1-20", status: "available", lastUpdated: "10:32 AM" },
  { id: "E02", name: "Elevator 2", building: "Tower A", floorRange: "1-20", status: "maintenance", lastUpdated: "09:10 AM" },
  { id: "E03", name: "Elevator 3", building: "Tower B", floorRange: "1-30", status: "out_of_order", lastUpdated: "08:55 AM" },
  { id: "E04", name: "Elevator 4", building: "Tower B", floorRange: "1-30", status: "available", lastUpdated: "11:15 AM" },
]

export function ElevatorDashboard() {
  const { user, logout } = useAuth()
  const [elevators, setElevators] = useState<Elevator[]>(INITIAL_ELEVATORS)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingElevator, setEditingElevator] = useState<Elevator | null>(null)

  // Form State
  const [formData, setFormData] = useState<Partial<Elevator>>({
    name: "",
    building: "",
    floorRange: "",
    status: "available",
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
    const newElevator: Elevator = {
      id: `E0${elevators.length + 1}`,
      name: formData.name || "New Elevator",
      building: formData.building || "Main Building",
      floorRange: formData.floorRange || "1-10",
      status: formData.status as ElevatorStatus,
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setElevators([...elevators, newElevator])
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
    setElevators(updatedElevators)
    setEditingElevator(null)
    resetForm()
  }

  const handleDeleteElevator = (id: string) => {
    if (confirm("Are you sure you want to delete this elevator?")) {
      setElevators(elevators.filter(e => e.id !== id))
    }
  }

  const resetForm = () => {
    setFormData({ name: "", building: "", floorRange: "", status: "available" })
  }

  const openEditDialog = (elevator: Elevator) => {
    setEditingElevator(elevator)
    setFormData({
      name: elevator.name,
      building: elevator.building,
      floorRange: elevator.floorRange,
      status: elevator.status,
    })
  }

  const getStatusBadge = (status: Elevator["status"]) => {
    switch (status) {
      case "available":
        return <Badge variant="success">Available</Badge>
      case "maintenance":
        return <Badge variant="warning">Maintenance</Badge>
      case "out_of_order":
        return <Badge variant="destructive">Out of Order</Badge>
    }
  }

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Elevator CMS</h1>
          <p className="text-muted-foreground mt-2">Real-time monitoring and status management system.</p>
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
            <CardTitle className="text-sm font-medium">Total Units</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Connected systems</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border-green-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Available</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{stats.available}</div>
            <p className="text-xs text-green-600/80">Units operational</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/5 border-yellow-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-700">Maintenance</CardTitle>
            <Settings className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700">{stats.maintenance}</div>
            <p className="text-xs text-yellow-600/80">Scheduled checks</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-500/10 to-rose-500/5 border-red-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-700">Out of Order</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">{stats.outOfOrder}</div>
            <p className="text-xs text-red-600/80">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Elevator Status Overview</CardTitle>
            <CardDescription>Comprehensive list of all units and their current operational state.</CardDescription>
          </div>
          {user?.role === 'admin' && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" /> Add Elevator
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Elevator</DialogTitle>
                  <DialogDescription>Enter elevator details to add it to the system.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Elevator Name</Label>
                    <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Elevator 5" />
                  </div>
                  <div className="space-y-2">
                    <Label>Building</Label>
                    <Input value={formData.building} onChange={e => setFormData({...formData, building: e.target.value})} placeholder="e.g. Tower C" />
                  </div>
                  <div className="space-y-2">
                    <Label>Floor Range</Label>
                    <Input value={formData.floorRange} onChange={e => setFormData({...formData, floorRange: e.target.value})} placeholder="e.g. 1-40" />
                  </div>
                  <div className="space-y-2">
                    <Label>Initial Status</Label>
                    <Select value={formData.status} onValueChange={v => setFormData({...formData, status: v as ElevatorStatus})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="out_of_order">Out of Order</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddElevator}>Confirm Add</Button>
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
                <TableHead>Building</TableHead>
                <TableHead>Floors</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                {user?.role !== 'viewer' && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {elevators.map((elevator) => (
                <TableRow key={elevator.id}>
                  <TableCell className="font-bold">{elevator.id}</TableCell>
                  <TableCell>{elevator.building}</TableCell>
                  <TableCell>{elevator.floorRange}</TableCell>
                  <TableCell>{getStatusBadge(elevator.status)}</TableCell>
                  <TableCell className="text-muted-foreground">{elevator.lastUpdated}</TableCell>
                  {user?.role !== 'viewer' && (
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(elevator)}>
                        <Edit className="w-4 h-4 text-blue-600" />
                      </Button>
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

      {/* Edit Dialog */}
      <Dialog open={!!editingElevator} onOpenChange={(open) => !open && setEditingElevator(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Elevator: {editingElevator?.id}</DialogTitle>
            <DialogDescription>Modify status or details for this elevator unit.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {user?.role === 'admin' && (
              <>
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Building</Label>
                  <Input value={formData.building} onChange={e => setFormData({...formData, building: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Floor Range</Label>
                  <Input value={formData.floorRange} onChange={e => setFormData({...formData, floorRange: e.target.value})} />
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label>Current Status</Label>
              <Select value={formData.status} onValueChange={v => setFormData({...formData, status: v as ElevatorStatus})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="out_of_order">Out of Order</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleUpdateElevator}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
